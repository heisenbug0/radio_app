import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import unicodedata

load_dotenv()

class DataPreparationService:
    def __init__(self):
        # sentence-transformers model
        self.model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
        self.products_df = None
        self.product_vectors = None
        self.pinecone_index = None
        self.initialize_pinecone()
    
    def initialize_pinecone(self):
        try:
            api_key = os.getenv('PINECONE_API_KEY')
            if api_key:
                from pinecone import Pinecone
                pc = Pinecone(api_key=api_key)
                index_name = "product-recommendations"
                # collect existing index names
                index_names = []
                try:
                    listed = pc.list_indexes()
                    if isinstance(listed, list):
                        for it in listed:
                            if isinstance(it, str):
                                index_names.append(it)
                            else:
                                name = getattr(it, 'name', None)
                                if not name and isinstance(it, dict):
                                    name = it.get('name')
                                if name:
                                    index_names.append(name)
                    elif isinstance(listed, dict):
                        for it in listed.get('indexes', []):
                            if isinstance(it, dict) and 'name' in it:
                                index_names.append(it['name'])
                except Exception:
                    pass
                if index_name not in index_names:
                    try:
                        # newer sdks use serverless spec
                        from pinecone import ServerlessSpec
                        cloud = os.getenv('PINECONE_CLOUD', 'aws')
                        region = os.getenv('PINECONE_REGION', 'us-east-1')
                        pc.create_index(
                            name=index_name,
                            dimension=768,
                            metric="cosine",
                            spec=ServerlessSpec(cloud=cloud, region=region)
                        )
                    except Exception:
                        # fallback to older signature
                        pc.create_index(name=index_name, dimension=768, metric="cosine")
                    print(f"created pinecone index: {index_name}")
                self.pinecone_index = pc.Index(index_name)
                print("pinecone ready")
            else:
                print("warning: no pinecone api key, using local search")
        except Exception as e:
            print(f"warning: pinecone init failed: {e}; using local search")
    
    def _normalize_ascii(self, text: str) -> str:
        if not isinstance(text, str):
            text = str(text) if text is not None else ""
        # normalize unicode to ascii
        text = unicodedata.normalize('NFKD', text)
        text = text.encode('ascii', 'ignore').decode('ascii')
        return text
    
    def clean_dataset(self, file_path):
        print("loading and cleaning dataset...")
        # latin-1 to avoid decode errors
        df = pd.read_csv(file_path, encoding='latin-1')
        df = df.drop_duplicates()

        # normalize stock codes and descriptions
        df['StockCode'] = df['StockCode'].astype(str).map(self._normalize_ascii).str.strip()
        df['StockCode'] = df['StockCode'].apply(lambda x: re.sub(r'[^A-Za-z0-9_-]', '', x))
        df['Description'] = df['Description'].astype(str).map(self._normalize_ascii).str.strip()
        df['Description'] = df['Description'].apply(lambda x: re.sub(r'[^A-Za-z0-9\s-]', ' ', x))
        df['Description'] = df['Description'].apply(lambda x: re.sub(r'\s+', ' ', x).strip())

        # uppercase for matching
        df['Description'] = df['Description'].str.upper()

        # drop noisy/missing descriptions
        noise_patterns_exact = [
            r'^UNKNOWN$', r'^UNKWN$', r'^NA$', r'^N/A$', r'^POSTAGE$', r'^CARRIAGE$', r'^SAMPLE$', r'^DAMAGED$', r'^BROKEN$'
        ]
        noise_regex_exact = re.compile('|'.join(noise_patterns_exact))
        df = df[~df['Description'].fillna('').apply(lambda t: bool(noise_regex_exact.search(t)) or ('MISSING' in t) or ('MIXED UP' in t))]

        # keep useful descriptions
        df = df[df['Description'].str.contains(r'[A-Z]', regex=True, na=False)]
        df = df[df['Description'].str.len() >= 3]

        # positive quantities and prices
        df['UnitPrice'] = pd.to_numeric(df['UnitPrice'], errors='coerce')
        df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce')
        df = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]

        # drop empty stock codes
        df = df[df['StockCode'].str.len() > 0]

        # aggregate
        self.products_df = df.groupby(['StockCode', 'Description']).agg({
            'UnitPrice': 'mean',
            'Quantity': 'sum'
        }).reset_index()

        print(f"cleaned dataset: {len(self.products_df)} products")
        return self.products_df
    
    def create_product_vectors(self):
        print("creating product embeddings (all-mpnet-base-v2)...")
        product_texts = self.products_df['Description'].tolist()
        self.product_vectors = self.model.encode(product_texts, show_progress_bar=True, convert_to_numpy=True)
        print(f"embeddings shape: {self.product_vectors.shape}")
        return self.product_vectors
    
    def upload_to_pinecone(self):
        if not self.pinecone_index:
            print("pinecone not available, skip upload")
            return
        print("uploading vectors to pinecone...")
        vectors_to_upsert = []
        for idx, row in self.products_df.iterrows():
            vector = self.product_vectors[idx].tolist()
            metadata = {
                'stock_code': row['StockCode'],
                'description': row['Description'],
                'unit_price': float(row['UnitPrice']),
                'quantity': int(row['Quantity'])
            }
            vectors_to_upsert.append((str(idx), vector, metadata))
        batch_size = 100
        for i in range(0, len(vectors_to_upsert), batch_size):
            batch = vectors_to_upsert[i:i + batch_size]
            self.pinecone_index.upsert(vectors=batch)
        print(f"uploaded {len(vectors_to_upsert)} vectors")
    
    def get_similarity_metrics(self):
        return {
            "primary_metric": "cosine_similarity",
            "reasoning": "cosine focuses on direction similarity and works well for semantic matching",
            "vectorization": "sentence-transformers (all-mpnet-base-v2)",
            "dimensions": self.product_vectors.shape[1] if self.product_vectors is not None else 0
        }
    
    def search_products(self, query, top_k=5):
        query_vector = self.model.encode([query], convert_to_numpy=True)[0]
        if self.pinecone_index:
            try:
                results = self.pinecone_index.query(
                    vector=query_vector.tolist(),
                    top_k=top_k,
                    include_metadata=True
                )
                products = []
                for match in results.matches:
                    products.append({
                        'stock_code': match.metadata['stock_code'],
                        'description': match.metadata['description'],
                        'unit_price': match.metadata['unit_price'],
                        'quantity': match.metadata['quantity'],
                        'similarity_score': match.score
                    })
                return products
            except Exception as e:
                print(f"pinecone search failed: {e}; using local search")
                return self._local_search(query_vector, top_k)
        else:
            return self._local_search(query_vector, top_k)
    
    def _local_search(self, query_vector, top_k=5):
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