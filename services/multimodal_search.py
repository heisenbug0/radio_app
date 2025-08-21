import base64
import json
import os
import time
from typing import List, Tuple

import numpy as np
import pandas as pd
import requests


class MultimodalSearchService:
    def __init__(self, products_df: pd.DataFrame, cache_dir: str = "models"):
        self.products_df_full = products_df.reset_index(drop=True)
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)
        self.hf_token = os.getenv("HUGGINGFACE_API_TOKEN") or os.getenv("HF_API_TOKEN")
        # default clip model
        self.clip_model = os.getenv("HF_CLIP_MODEL", os.getenv("HF_ZERO_SHOT_MODEL", "laion/CLIP-ViT-B-32-laion2B-s34B-b79K"))
        self.text_emb_path = os.path.join(self.cache_dir, "clip_text_embeddings.npy")
        self.text_ids_path = os.path.join(self.cache_dir, "clip_text_ids.json")
        self.text_embeddings = None
        self.text_ids = None
        self.products_df_clip = None
        # basic config
        self.filter_to_train_csv = (os.getenv("MM_FILTER_TO_TRAIN_CSV", "true").strip().lower() in {"1","true","yes"})
        self.train_csv_path = os.getenv("MM_TRAIN_CSV_PATH", "data/CNN_Model_Train_Data.csv")
        self.max_products = int(os.getenv("MM_MAX_PRODUCTS", "500"))
        self.batch_size = int(os.getenv("HF_TEXT_EMBED_BATCH", "16"))
        self.max_retries = int(os.getenv("HF_REQUEST_RETRIES", "5"))
        self.retry_sleep = float(os.getenv("HF_REQUEST_RETRY_SLEEP", "2.0"))

    def _headers(self):
        headers = {"Accept": "application/json"}
        if self.hf_token:
            headers["Authorization"] = f"Bearer {self.hf_token}"
        return headers

    def _normalize(self, x: np.ndarray) -> np.ndarray:
        norm = np.linalg.norm(x, axis=1, keepdims=True) + 1e-12
        return x / norm

    def _post_json(self, url: str, payload: dict) -> requests.Response:
        last_exc = None
        for attempt in range(self.max_retries):
            try:
                r = requests.post(url, headers=self._headers(), json=payload, timeout=60)
                if r.status_code in (429, 503):
                    time.sleep(self.retry_sleep * (attempt + 1))
                    continue
                return r
            except Exception as e:
                last_exc = e
                time.sleep(self.retry_sleep * (attempt + 1))
        if last_exc:
            raise last_exc
        raise RuntimeError("HTTP request failed")

    def _feature_extraction_text(self, texts: List[str]) -> np.ndarray:
        # prefer pipeline endpoint
        url = "https://api-inference.huggingface.co/pipeline/feature-extraction"
        payload = {"model": self.clip_model, "inputs": texts, "options": {"wait_for_model": True}}
        r = self._post_json(url, payload)
        if r.status_code >= 400:
            try:
                print(f"[HF_TEXT_ERR] pipeline status={r.status_code} body={r.text[:200]}")
            except Exception:
                pass
            # fallback to model endpoint
            url2 = f"https://api-inference.huggingface.co/models/{self.clip_model}"
            payload2 = {"inputs": texts, "options": {"wait_for_model": True}}
            r = self._post_json(url2, payload2)
        r.raise_for_status()
        data = r.json()
        arr = np.array(data)
        if arr.ndim == 3:
            arr = arr.mean(axis=1)
        if arr.ndim == 1:
            arr = arr.reshape(1, -1)
        return arr.astype(np.float32)

    def _feature_extraction_image(self, image_path: str) -> np.ndarray:
        with open(image_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")
        mime = "image/jpeg"
        if image_path.lower().endswith(".png"):
            mime = "image/png"
        data_url = f"data:{mime};base64,{b64}"
        url = "https://api-inference.huggingface.co/pipeline/image-feature-extraction"
        payload = {"model": self.clip_model, "inputs": data_url, "options": {"wait_for_model": True}}
        r = self._post_json(url, payload)
        if r.status_code >= 400:
            try:
                print(f"[HF_IMG_ERR] pipeline status={r.status_code} body={r.text[:200]}")
            except Exception:
                pass
            url2 = f"https://api-inference.huggingface.co/models/{self.clip_model}"
            payload2 = {"inputs": {"image": data_url}, "options": {"wait_for_model": True}}
            r = self._post_json(url2, payload2)
        r.raise_for_status()
        data = r.json()
        vec = np.array(data, dtype=np.float32)
        if vec.ndim > 1:
            vec = vec.mean(axis=tuple(range(1, vec.ndim)))
        return vec.reshape(1, -1)

    def _prepare_products_subset(self) -> pd.DataFrame:
        df = self.products_df_full
        if self.filter_to_train_csv and os.path.exists(self.train_csv_path):
            try:
                train_df = pd.read_csv(self.train_csv_path, dtype=str)
                if "StockCode" in train_df.columns:
                    codes = set(train_df["StockCode"].astype(str).str.strip())
                    df = df[df["StockCode"].astype(str).str.strip().isin(codes)]
            except Exception:
                pass
        if self.max_products > 0 and len(df) > self.max_products:
            df = df.head(self.max_products)
        return df.reset_index(drop=True)

    def build_or_load_text_embeddings(self) -> Tuple[np.ndarray, List[int]]:
        # load cache if present
        if os.path.exists(self.text_emb_path) and os.path.exists(self.text_ids_path):
            try:
                emb = np.load(self.text_emb_path)
                with open(self.text_ids_path, "r") as f:
                    ids = json.load(f)
                if emb.shape[0] == len(ids) and emb.ndim == 2:
                    self.text_embeddings = emb
                    self.text_ids = ids
                    self.products_df_clip = self.products_df_full.iloc[ids].reset_index(drop=True)
                    return emb, ids
            except Exception:
                pass
        # build subset and texts
        df_clip = self._prepare_products_subset()
        texts = df_clip['Description'].astype(str).tolist()
        ids = df_clip.index.tolist()
        all_emb = []
        for i in range(0, len(texts), self.batch_size):
            batch = texts[i:i+self.batch_size]
            try:
                emb = self._feature_extraction_text(batch)
                all_emb.append(emb)
            except Exception as e:
                try:
                    print(f"[HF_TEXT_BATCH_FAIL] i={i} err={e}")
                except Exception:
                    pass
                time.sleep(self.retry_sleep)
                continue
        if not all_emb:
            raise RuntimeError("Failed to build text embeddings via HF API")
        emb = np.vstack(all_emb)
        emb = self._normalize(emb[:len(texts)])
        np.save(self.text_emb_path, emb)
        with open(self.text_ids_path, "w") as f:
            json.dump(ids, f)
        self.text_embeddings = emb
        self.text_ids = ids
        self.products_df_clip = df_clip
        return emb, ids

    def search_by_image(self, image_path: str, top_k: int = 5):
        try:
            if self.text_embeddings is None:
                self.build_or_load_text_embeddings()
            img_emb = self._feature_extraction_image(image_path)
            img_emb = self._normalize(img_emb)
            sims = (img_emb @ self.text_embeddings.T)[0]
            top_idx = np.argsort(sims)[-top_k:][::-1]
            results = []
            for rank, idx in enumerate(top_idx, start=1):
                row = self.products_df_clip.iloc[idx]
                results.append({
                    "rank": rank,
                    "stock_code": row['StockCode'],
                    "description": row['Description'],
                    "unit_price": float(row['UnitPrice']),
                    "quantity": int(row['Quantity']),
                    "similarity_score": float(sims[idx])
                })
            return results
        except Exception as e:
            try:
                print(f"[MM_ERR] {e}")
            except Exception:
                pass
            return []