import json
import os
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd
from PIL import Image
from sentence_transformers import SentenceTransformer


class LocalMultimodalSearchService:
    def __init__(self, products_df: pd.DataFrame, cache_dir: str = "models"):
        self.products_df = products_df.reset_index(drop=True)
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)
        # clip text+image model (local)
        self.model_name = os.getenv("CLIP_LOCAL_MODEL", "clip-ViT-B-32")
        self.model = SentenceTransformer(self.model_name)
        # cache files
        safe_name = self.model_name.replace('/', '_')
        self.text_emb_path = os.path.join(self.cache_dir, f"{safe_name}_text_embeddings.npy")
        self.text_ids_path = os.path.join(self.cache_dir, f"{safe_name}_text_ids.json")
        self.text_embeddings = None
        self.text_ids = None

    def _normalize_rows(self, arr: np.ndarray) -> np.ndarray:
        norms = np.linalg.norm(arr, axis=1, keepdims=True) + 1e-12
        return arr / norms

    def build_or_load_text_embeddings(self, max_products: int = 2000, batch_size: int = 64) -> Tuple[np.ndarray, List[int]]:
        if os.path.exists(self.text_emb_path) and os.path.exists(self.text_ids_path):
            try:
                emb = np.load(self.text_emb_path)
                with open(self.text_ids_path, 'r') as f:
                    ids = json.load(f)
                if emb.ndim == 2 and emb.shape[0] == len(ids):
                    self.text_embeddings = emb
                    self.text_ids = ids
                    return emb, ids
            except Exception:
                pass
        df = self.products_df
        if max_products > 0 and len(df) > max_products:
            df = df.head(max_products)
        texts = df['Description'].astype(str).tolist()
        ids = df.index.tolist()
        # encode texts
        embeddings = self.model.encode(texts, batch_size=batch_size, convert_to_numpy=True, show_progress_bar=True)
        embeddings = self._normalize_rows(embeddings)
        np.save(self.text_emb_path, embeddings)
        with open(self.text_ids_path, 'w') as f:
            json.dump(ids, f)
        self.text_embeddings = embeddings
        self.text_ids = ids
        return embeddings, ids

    def search_by_image(self, image_path: str, top_k: int = 5) -> List[Dict]:
        if self.text_embeddings is None:
            # reasonable defaults; override via env if needed
            max_products = int(os.getenv("CLIP_LOCAL_MAX_PRODUCTS", "2000"))
            batch_size = int(os.getenv("CLIP_LOCAL_TEXT_BATCH", "64"))
            self.build_or_load_text_embeddings(max_products=max_products, batch_size=batch_size)
        # encode image
        image = Image.open(image_path).convert('RGB')
        img_emb = self.model.encode([image], convert_to_numpy=True)
        img_emb = self._normalize_rows(img_emb)
        sims = (img_emb @ self.text_embeddings.T)[0]
        top_idx = np.argsort(sims)[-top_k:][::-1]
        results = []
        for rank, idx in enumerate(top_idx, start=1):
            row = self.products_df.iloc[self.text_ids[idx]]
            results.append({
                "rank": rank,
                "stock_code": row['StockCode'],
                "description": row['Description'],
                "unit_price": float(row['UnitPrice']),
                "quantity": int(row['Quantity']),
                "similarity_score": float(sims[idx])
            })
        return results