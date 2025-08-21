# services/web_scraping/service.py
import logging
import math
import os
import random
import time

import pandas as pd
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


class WebScrapingService:
    def __init__(self, serpapi_key=None, download_dir="data/scraped_images", min_width=200, min_height=200, per_request_min=3):
        self.serpapi_key = serpapi_key or os.getenv("SERPAPI_API_KEY")
        self.pixabay_key = os.getenv("PIXABAY_API_KEY")
        self.download_dir = download_dir
        self.results = []
        self._seen_urls = set()
        self._seen_hashes = set()
        self.min_width = int(min_width)
        self.min_height = int(min_height)
        self.per_request_min = max(3, int(per_request_min))
        os.makedirs(self.download_dir, exist_ok=True)

    def search_images_serpapi(self, query, count=10):
        from services.web_search.serpapi_client import SerpApiClient
        safe_query = (query or "").strip()[:200]
        client = SerpApiClient(self.serpapi_key)
        images = client.search_images(safe_query, max(self.per_request_min, min(int(count), 100)))
        logger.info("SerpAPI returned %d image candidates", len(images))
        return images

    def search_images_pixabay(self, query, count=10):
        from services.web_search.pixabay_client import PixabayClient
        safe_query = (query or "").strip()[:200]
        client = PixabayClient(self.pixabay_key)
        images = client.search_images(safe_query, max(self.per_request_min, min(int(count), 200)))
        logger.info("Pixabay returned %d image candidates", len(images))
        return images

    def _clean_product_name(self, product_name):
        from services.web_scraping.queries import clean_product_name
        return clean_product_name(product_name)

    def _download_and_validate(self, url):
        from services.web_scraping.downloader import download_and_validate
        result = download_and_validate(url, self.min_width, self.min_height)
        return result

    def _unique_filename(self, stock_code, index, ext, content_hash):
        from services.web_scraping.naming import unique_filename
        return unique_filename(self.download_dir, stock_code, index, ext, content_hash)

    def _search_product_images_robust(self, product_name, max_images=10):
        optimized = self._clean_product_name(product_name)
        logger.info("Optimized search term: '%s'", optimized)
        variations = [optimized, f"{optimized} product", f"{optimized} photo", f"{optimized} item", f"{optimized} retail"]
        if max_images <= 5:
            variations = variations[:3]
        images_per_variation = max(self.per_request_min, math.ceil(max(1, max_images) / max(1, len(variations))))
        collected = []
        for q in variations:
            found = []
            # Prefer SerpAPI if available, else Pixabay
            if self.serpapi_key:
                found = self.search_images_serpapi(q, images_per_variation)
            elif self.pixabay_key:
                found = self.search_images_pixabay(q, images_per_variation)
            else:
                logger.error("No image search API key provided. Set SERPAPI_API_KEY or PIXABAY_API_KEY in env.")
                return []
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
        if not (self.serpapi_key or self.pixabay_key):
            logger.error("No image API key set. Set SERPAPI_API_KEY or PIXABAY_API_KEY in environment.")
            return pd.DataFrame()
        logger.info("Starting scraping using %s. images_per_product=%d",
                    "SerpAPI" if self.serpapi_key else "Pixabay", images_per_product)
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

