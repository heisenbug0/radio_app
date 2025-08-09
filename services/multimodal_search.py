import os
import json
import time
import base64
import numpy as np
import pandas as pd
import requests
from typing import List, Tuple

class MultimodalSearchService:
    def __init__(self, products_df: pd.DataFrame, cache_dir: str = "models"):
        self.products_df = products_df
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)
        self.hf_token = os.getenv("HUGGINGFACE_API_TOKEN") or os.getenv("HF_API_TOKEN")
        self.clip_model = os.getenv("HF_CLIP_MODEL", os.getenv("HF_ZERO_SHOT_MODEL", "openai/clip-vit-base-patch32"))
        self.text_emb_path = os.path.join(self.cache_dir, f"clip_text_embeddings.npy")
        self.text_ids_path = os.path.join(self.cache_dir, f"clip_text_ids.json")
        self.text_embeddings = None
        self.text_ids = None

    def _headers(self):
        headers = {"Accept": "application/json"}
        if self.hf_token:
            headers["Authorization"] = f"Bearer {self.hf_token}"
        return headers

    def _normalize(self, x: np.ndarray) -> np.ndarray:
        norm = np.linalg.norm(x, axis=1, keepdims=True) + 1e-12
        return x / norm

    def _feature_extraction_text(self, texts: List[str]) -> np.ndarray:
        url = f"https://api-inference.huggingface.co/pipeline/feature-extraction"
        payload = {"inputs": texts, "options": {"wait_for_model": True}, "parameters": {"model": self.clip_model}}
        r = requests.post(url, headers=self._headers(), json=payload, timeout=60)
        if r.status_code >= 400:
            # Try model-specific endpoint
            url2 = f"https://api-inference.huggingface.co/models/{self.clip_model}"
            payload2 = {"inputs": texts, "options": {"wait_for_model": True}}
            r = requests.post(url2, headers=self._headers(), json=payload2, timeout=60)
        r.raise_for_status()
        data = r.json()
        # Data can be [ [dim] , [dim] , ... ] or nested
        arr = np.array(data)
        if arr.ndim == 3:
            arr = arr.mean(axis=1)
        return arr.astype(np.float32)

    def _feature_extraction_image(self, image_path: str) -> np.ndarray:
        with open(image_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")
        mime = "image/jpeg"
        if image_path.lower().endswith(".png"):
            mime = "image/png"
        data_url = f"data:{mime};base64,{b64}"
        # Try pipeline endpoint first
        url = f"https://api-inference.huggingface.co/pipeline/image-feature-extraction"
        payload = {"inputs": data_url, "options": {"wait_for_model": True}, "parameters": {"model": self.clip_model}}
        r = requests.post(url, headers=self._headers(), json=payload, timeout=60)
        if r.status_code >= 400:
            # Try model endpoint
            url2 = f"https://api-inference.huggingface.co/models/{self.clip_model}"
            payload2 = {"inputs": {"image": data_url}, "options": {"wait_for_model": True}}
            r = requests.post(url2, headers=self._headers(), json=payload2, timeout=60)
        r.raise_for_status()
        data = r.json()
        vec = np.array(data, dtype=np.float32)
        if vec.ndim > 1:
            vec = vec.mean(axis=tuple(range(1, vec.ndim)))
        return vec.reshape(1, -1)

    def build_or_load_text_embeddings(self) -> Tuple[np.ndarray, List[int]]:
        # Load cache if present
        if os.path.exists(self.text_emb_path) and os.path.exists(self.text_ids_path):
            try:
                emb = np.load(self.text_emb_path)
                with open(self.text_ids_path, "r") as f:
                    ids = json.load(f)
                # Basic sanity
                if emb.shape[0] == len(ids) and emb.ndim == 2:
                    self.text_embeddings = emb
                    self.text_ids = ids
                    return emb, ids
            except Exception:
                pass
        # Build texts list
        texts = self.products_df['Description'].astype(str).tolist()
        ids = list(range(len(texts)))
        # Batch API calls for efficiency
        batch_size = int(os.getenv("HF_TEXT_EMBED_BATCH", "64"))
        all_emb = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]
            try:
                emb = self._feature_extraction_text(batch)
                all_emb.append(emb)
            except Exception:
                # Backoff on error
                time.sleep(1.0)
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
        return emb, ids

    def search_by_image(self, image_path: str, top_k: int = 5):
        if self.text_embeddings is None:
            self.build_or_load_text_embeddings()
        img_emb = self._feature_extraction_image(image_path)
        img_emb = self._normalize(img_emb)
        sims = (img_emb @ self.text_embeddings.T)[0]
        top_idx = np.argsort(sims)[-top_k:][::-1]
        results = []
        for rank, idx in enumerate(top_idx, start=1):
            row = self.products_df.iloc[idx]
            results.append({
                "rank": rank,
                "stock_code": row['StockCode'],
                "description": row['Description'],
                "unit_price": float(row['UnitPrice']),
                "quantity": int(row['Quantity']),
                "similarity_score": float(sims[idx])
            })
        return results