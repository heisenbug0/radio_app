import pandas as pd
import numpy as np
import os
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
from services.data_prep.cleaning import clean_dataframe
# Lazy/optional imports to avoid heavy deps at app startup
try:
	from services.embeddings.text_embedder import TextEmbedder  # requires sentence_transformers/torch
except Exception:
	TextEmbedder = None

try:
	from services.vectorstore.pinecone_store import init_pinecone, upsert_vectors, query_vectors
except Exception:
	init_pinecone = upsert_vectors = query_vectors = None

load_dotenv()

class DataPreparationService:
    """load, clean, embed, and search products"""
    def __init__(self) -> None:
        self.embedder = None
        self.products_df = None
        self.product_vectors = None
        self.pinecone_index = None
        self.initialize_pinecone()
    
    def initialize_pinecone(self) -> None:
        """init pinecone if creds exist"""
        try:
            if init_pinecone is not None:
                self.pinecone_index = init_pinecone()
            else:
                self.pinecone_index = None
        except Exception:
            self.pinecone_index = None
    
    def _normalize_ascii(self, text: str) -> str:
        # if not isinstance(text, str):
        #     text = str(text) if text is not None else ""
        text = unicodedata.normalize('NFKD', text)
        text = text.encode('ascii', 'ignore').decode('ascii')
        return text
    
    def clean_dataset(self, file_path: str):
        """load and clean the csv"""
        print("loading and cleaning dataset...")
        df = pd.read_csv(file_path, encoding='latin-1').drop_duplicates()
        df = clean_dataframe(df)

        # aggregate
        self.products_df = df.groupby(['StockCode', 'Description']).agg({
            'UnitPrice': 'mean',
            'Quantity': 'sum'
        }).reset_index()

        print(f"cleaned dataset: {len(self.products_df)} products")
        return self.products_df
    
    def create_product_vectors(self):
        """build embeddings for descriptions"""
        print("creating product embeddings (all-mpnet-base-v2)...")
        if self.embedder is None:
            if TextEmbedder is None:
                raise RuntimeError("Text embedding backend unavailable; install sentence-transformers & torch")
            self.embedder = TextEmbedder()
        product_texts = self.products_df['Description'].tolist()
        self.product_vectors = self.embedder.encode(product_texts)
        print(f"embeddings shape: {self.product_vectors.shape}")
        return self.product_vectors
    
    def upload_to_pinecone(self) -> None:
        """push vectors if pinecone is configured"""
        if not self.pinecone_index:
            print("pinecone not available, skip upload")
            return
        print("uploading vectors to pinecone...")
        to_upsert = []
        for idx, row in self.products_df.iterrows():
            to_upsert.append((str(idx), self.product_vectors[idx].tolist(), {
                'stock_code': row['StockCode'],
                'description': row['Description'],
                'unit_price': float(row['UnitPrice']),
                'quantity': int(row['Quantity'])
            }))
        upsert_vectors(self.pinecone_index, to_upsert)
        print(f"uploaded {len(to_upsert)} vectors")
    
    def get_similarity_metrics(self) -> Dict[str, Any]:
        """brief metrics summary"""
        return {
            "primary_metric": "cosine_similarity",
            "reasoning": "cosine focuses on direction similarity and works well for semantic matching",
            "vectorization": "sentence-transformers (all-mpnet-base-v2)",
            "dimensions": self.product_vectors.shape[1] if self.product_vectors is not None else 0
        }
    
    def search_products(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """embed query and return top k products"""
        if self.embedder is None:
            if TextEmbedder is None:
                raise RuntimeError("Text embedding backend unavailable; install sentence-transformers & torch")
            self.embedder = TextEmbedder()
        query_vector = self.embedder.encode([query])[0]

        if self.pinecone_index:
            try:
                return query_vectors(self.pinecone_index, query_vector.tolist(), top_k)
            except Exception as e:
                print(f"pinecone search failed: {e}; using local search")
                return self._local_search(query_vector, top_k)
        else:
            return self._local_search(query_vector, top_k)
    
    def _local_search(self, query_vector: np.ndarray, top_k: int = 5) -> List[Dict[str, Any]]:
        similarities = cosine_similarity([query_vector], self.product_vectors)[0]
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        products = []
        for idx in top_indices:
            row = self.products_df.iloc[idx]
            products.append({
                'stock_code': row['StockCode'],
                'description': row['Description'],
                'unit_price': float(row['UnitPrice']),
                'quantity': int(row['Quantity']),
                'similarity_score': float(similarities[idx])
            })
        return products