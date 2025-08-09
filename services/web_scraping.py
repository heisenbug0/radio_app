# services/web_scraping.py
import os
import time
import random
import math
import hashlib
import logging
import requests
import pandas as pd
from io import BytesIO
from PIL import Image

from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


class WebScrapingService:
    def __init__(self, serpapi_key=None, download_dir="data/scraped_images", min_width=200, min_height=200, per_request_min=3):
        self.serpapi_key = serpapi_key or os.getenv("SERPAPI_API_KEY")
        self.download_dir = download_dir
        self.results = []
        self._seen_urls = set()
        self._seen_hashes = set()
        self.min_width = int(min_width)
        self.min_height = int(min_height)
        self.per_request_min = max(3, int(per_request_min))
        os.makedirs(self.download_dir, exist_ok=True)

    def search_images_serpapi(self, query, count=10):
        if not self.serpapi_key:
            logger.warning("SerpAPI key missing.")
            return []
        safe_query = (query or "").strip()[:200]
        params = {
            "engine": "google",
            "q": safe_query,
            "tbm": "isch",
            "num": max(self.per_request_min, min(int(count), 100)),
            "api_key": self.serpapi_key,
        }
        try:
            logger.info("SerpAPI search: q=%s num=%d", safe_query, params["num"])
            r = requests.get("https://serpapi.com/search.json", params=params, timeout=15)
            if r.status_code != 200:
                logger.warning("SerpAPI returned %s: %s", r.status_code, r.text[:300])
                return []
            data = r.json()
            hits = data.get("images_results") or data.get("image_results") or data.get("inline_images") or []
            images = []
            for h in hits:
                # SerpAPI image result fields vary: 'original', 'thumbnail', 'link', 'title'
                url = h.get("original") or h.get("origin") or h.get("link") or h.get("thumbnail")
                title = h.get("title") or h.get("alt") or h.get("snippet") or ""
                width = h.get("width") or 0
                height = h.get("height") or 0
                if url:
                    images.append({"url": url, "title": title, "width": width, "height": height})
            logger.info("SerpAPI returned %d image candidates", len(images))
            return images
        except Exception as e:
            logger.exception("SerpAPI search error: %s", e)
            return []

    def _clean_product_name(self, product_name):
        if not product_name or pd.isna(product_name):
            return None
        name = str(product_name).strip()
        prefixes = ["SET OF ", "SET ", "PACK OF ", "PACK ", "BOX OF ", "BOX ", "LARGE ", "SMALL ", "MINI ", "$", "£", "€", "¥"]
        for p in prefixes:
            if name.upper().startswith(p):
                name = name[len(p):].strip()
        import re
        name = re.sub(r"[^\w\s]", " ", name)
        name = re.sub(r"\s+", " ", name).strip()
        words = [w for w in name.split() if len(w) > 2 and not w.isdigit()]
        if not words:
            return name[:50]
        return " ".join(words[:4])

    def _download_and_validate(self, url):
        try:
            headers = {"User-Agent": random.choice([
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                "Mozilla/5.0 (X11; Linux x86_64)"
            ])}
            r = requests.get(url, headers=headers, timeout=18, stream=True)
            r.raise_for_status()
            content_type = r.headers.get("content-type", "")
            if not content_type or not content_type.startswith("image/"):
                logger.debug("Non-image content-type %s for url %s", content_type, url)
                return None
            data = r.content
            h = hashlib.sha256(data).hexdigest()
            if h in self._seen_hashes:
                logger.debug("Duplicate image by hash %s", h[:12])
                return None
            img = Image.open(BytesIO(data)).convert("RGB")
            w, hgt = img.size
            if w < self.min_width or hgt < self.min_height:
                logger.debug("Image too small %dx%d (min %dx%d) %s", w, hgt, self.min_width, self.min_height, url)
                return None
            fmt = (img.format or "").lower()
            ext = "jpg"
            if "png" in fmt:
                ext = "png"
            elif "webp" in fmt:
                ext = "webp"
            return {"bytes": data, "hash": hashlib.sha256(data).hexdigest(), "width": w, "height": hgt, "ext": ext}
        except Exception as e:
            logger.debug("Download/validate error for %s: %s", url, e)
            return None

    def _unique_filename(self, stock_code, index, ext, content_hash):
        short = content_hash[:10]
        safe_code = "".join(c for c in str(stock_code) if c.isalnum() or c in ("-", "_")).strip() or "prod"
        base = f"{safe_code}_{index}_{short}"
        filename = f"{base}.{ext}"
        path = os.path.join(self.download_dir, filename)
        i = 1
        while os.path.exists(path):
            filename = f"{base}_{i}.{ext}"
            path = os.path.join(self.download_dir, filename)
            i += 1
        return filename, path

    def _search_product_images_robust(self, product_name, max_images=10):
        optimized = self._clean_product_name(product_name)
        logger.info("Optimized search term: '%s'", optimized)
        variations = [optimized, f"{optimized} product", f"{optimized} photo", f"{optimized} item", f"{optimized} retail"]
        if max_images <= 5:
            variations = variations[:3]
        images_per_variation = max(self.per_request_min, math.ceil(max(1, max_images) / max(1, len(variations))))
        collected = []
        for q in variations:
            found = self.search_images_serpapi(q, images_per_variation)
            if found:
                for f in found:
                    u = f.get("url")
                    if u and u not in self._seen_urls:
                        collected.append(f)
                        self._seen_urls.add(u)
                        if len(collected) >= max_images:
                            break
            if len(collected) >= max_images:
                break
            time.sleep(random.uniform(0.4, 1.2))
        unique = []
        seen = set()
        for item in collected:
            u = item.get("url")
            if u and u not in seen:
                unique.append(item)
                seen.add(u)
            if len(unique) >= max_images:
                break
        logger.info("Found %d unique candidate images (requested %d)", len(unique), max_images)
        return unique

    def _download_images_robust(self, stock_code, images):
        downloaded = 0
        for idx, info in enumerate(images, start=1):
            url = info.get("url")
            if not url:
                continue
            result = self._download_and_validate(url)
            if not result:
                logger.debug("Skipped invalid/duplicate image: %s", url)
                continue
            content_hash = result["hash"]
            if content_hash in self._seen_hashes:
                continue
            filename, path = self._unique_filename(stock_code, downloaded + 1, result["ext"], content_hash)
            try:
                with open(path, "wb") as f:
                    f.write(result["bytes"])
                self._seen_hashes.add(content_hash)
                self.results.append({
                    "stock_code": stock_code,
                    "filename": filename,
                    "url": url,
                    "width": result["width"],
                    "height": result["height"],
                    "status": "success"
                })
                downloaded += 1
                logger.info("Saved %s -> %s (%dx%d)", url, filename, result["width"], result["height"])
            except Exception as e:
                logger.exception("Failed saving image %s: %s", path, e)
            time.sleep(random.uniform(0.2, 0.6))
        return downloaded

    def scrape_product_images(self, csv_file_path, images_per_product=5):
        if not self.serpapi_key:
            logger.error("No SerpAPI key set. Set SERPAPI_API_KEY in environment.")
            return pd.DataFrame()
        logger.info("Starting scraping using SerpAPI. images_per_product=%d", images_per_product)
        df = pd.read_csv(csv_file_path, dtype=str)
        if "StockCode" not in df.columns:
            logger.error("CSV missing 'StockCode' column.")
            return pd.DataFrame()
        df = df.drop_duplicates(subset=["StockCode"])
        if "Description" not in df.columns or df["Description"].isna().all():
            try:
                main_df = pd.read_csv("data/dataset.csv", dtype=str, encoding="latin-1")
                main_df = main_df.rename(columns={c: c.strip() for c in main_df.columns})
                if "StockCode" in main_df.columns and "Description" in main_df.columns:
                    merged = df.merge(main_df[["StockCode", "Description"]].drop_duplicates(), on="StockCode", how="left")
                    merged = merged.dropna(subset=["Description"])
                    df = merged
            except Exception as e:
                logger.error("Could not load main dataset for descriptions: %s", e)
                return pd.DataFrame()
        if "Description" not in df.columns:
            logger.error("No product descriptions available after merge.")
            return pd.DataFrame()
        total_images = 0
        successful_products = 0
        for i, row in df.iterrows():
            stock_code = str(row["StockCode"]).strip()
            product_name = row.get("Description", "")
            if not product_name or stock_code == "":
                logger.info("Skipping stock_code=%s (no description)", stock_code)
                continue
            if any(r.get("stock_code") == stock_code for r in self.results):
                logger.info("Already processed %s", stock_code)
                continue
            logger.info("Processing product %d/%d: %s", i + 1, len(df), stock_code)
            logger.info("Product name: %s", product_name)
            try:
                images = self._search_product_images_robust(product_name, max_images=images_per_product)
                if images:
                    downloaded_count = self._download_images_robust(stock_code, images)
                    total_images += downloaded_count
                    successful_products += 1 if downloaded_count > 0 else 0
                    logger.info("Downloaded %d images for %s", downloaded_count, stock_code)
                else:
                    logger.info("No images found for %s", stock_code)
            except Exception as e:
                logger.exception("Error processing %s: %s", stock_code, e)
            time.sleep(random.uniform(1.0, 2.0))
        logger.info("Scraping completed: processed %d/%d products, total images %d", successful_products, len(df), total_images)
        results_df = pd.DataFrame(self.results)
        if not results_df.empty:
            results_path = os.path.join(self.download_dir, "scraping_results.csv")
            results_df.to_csv(results_path, index=False)
            logger.info("Results saved to: %s", results_path)
        return results_df

    def cleanup(self):
        pass
