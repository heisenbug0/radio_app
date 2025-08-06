import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv
import re

load_dotenv()

class DataPreparationService:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.products_df = None
        self.product_vectors = None
        self.pinecone_index = None
        self.initialize_pinecone()
    
    def initialize_pinecone(self):
        """Initialize Pinecone vector database using latest API"""
        try:
            api_key = os.getenv('PINECONE_API_KEY')
            
            if api_key:
                # Use the latest Pinecone API (v7.3.0+)
                from pinecone import Pinecone
                
                # Initialize Pinecone client
                pc = Pinecone(api_key=api_key)
                index_name = "product-recommendations"
                
                # Check if index exists, if not create it
                existing_indexes = [index.name for index in pc.list_indexes()]
                if index_name not in existing_indexes:
                    pc.create_index(
                        name=index_name,
                        dimension=1000,
                        metric="cosine"
                    )
                    print(f"Created new Pinecone index: {index_name}")
                
                # Connect to the index
                self.pinecone_index = pc.Index(index_name)
                print("Pinecone initialized successfully with latest API")
            else:
                print("Warning: PINECONE_API_KEY not found. Using local storage only.")
        except Exception as e:
            print(f"Warning: Pinecone initialization failed: {e}. Using local storage only.")
    
    def clean_dataset(self, file_path):
        """Clean the e-commerce dataset"""
        print("Loading and cleaning dataset...")
        
        # Load dataset
        df = pd.read_csv(file_path)
        
        # Remove duplicates
        df = df.drop_duplicates()
        
        # Clean StockCode column
        df['StockCode'] = df['StockCode'].astype(str).str.strip()
        df['StockCode'] = df['StockCode'].apply(lambda x: re.sub(r'[^\w\s-]', '', x))
        
        # Clean Description column
        df['Description'] = df['Description'].astype(str).str.strip()
        df['Description'] = df['Description'].apply(lambda x: re.sub(r'[^\w\s-]', '', x))
        
        # Handle missing values
        df['Description'] = df['Description'].fillna('Unknown Product')
        df['StockCode'] = df['StockCode'].fillna('UNKNOWN')
        
        # Remove rows with empty descriptions
        df = df[df['Description'].str.len() > 0]
        
        # Ensure numeric columns are properly typed
        df['UnitPrice'] = pd.to_numeric(df['UnitPrice'], errors='coerce').fillna(0.0)
        df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce').fillna(0)
        
        # Create unique product entries
        self.products_df = df.groupby(['StockCode', 'Description']).agg({
            'UnitPrice': 'mean',
            'Quantity': 'sum'
        }).reset_index()
        
        print(f"Cleaned dataset: {len(self.products_df)} unique products")
        return self.products_df
    
    def create_product_vectors(self):
        """Create TF-IDF vectors for products"""
        print("Creating product vectors...")
        
        # Combine StockCode and Description for vectorization
        product_texts = self.products_df['StockCode'] + ' ' + self.products_df['Description']
        
        # Create TF-IDF vectors
        self.product_vectors = self.vectorizer.fit_transform(product_texts)
        
        print(f"Created vectors with shape: {self.product_vectors.shape}")
        return self.product_vectors
    
    def upload_to_pinecone(self):
        """Upload product vectors to Pinecone using latest API"""
        if not self.pinecone_index:
            print("Pinecone not available. Skipping upload.")
            return
        
        print("Uploading vectors to Pinecone...")
        
        vectors_to_upsert = []
        for idx, row in self.products_df.iterrows():
            vector = self.product_vectors[idx].toarray()[0].tolist()
            metadata = {
                'stock_code': row['StockCode'],
                'description': row['Description'],
                'unit_price': float(row['UnitPrice']),
                'quantity': int(row['Quantity'])
            }
            vectors_to_upsert.append((str(idx), vector, metadata))
        
        # Upload in batches using latest API format
        batch_size = 100
        for i in range(0, len(vectors_to_upsert), batch_size):
            batch = vectors_to_upsert[i:i + batch_size]
            self.pinecone_index.upsert(vectors=batch)
        
        print(f"Uploaded {len(vectors_to_upsert)} vectors to Pinecone")
    
    def get_similarity_metrics(self):
        """Return information about similarity metrics used"""
        return {
            "primary_metric": "cosine_similarity",
            "reasoning": "Cosine similarity is ideal for text-based product matching as it measures the cosine of the angle between two vectors, making it invariant to vector magnitude and focusing on direction similarity.",
            "vectorization": "TF-IDF",
            "dimensions": self.product_vectors.shape[1] if self.product_vectors is not None else 0
        }
    
    def search_products(self, query, top_k=5):
        """Search for similar products using the vector database"""
        # Vectorize the query
        query_vector = self.vectorizer.transform([query]).toarray()[0]
        
        if self.pinecone_index:
            # Search in Pinecone using latest API
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
                print(f"Pinecone search failed: {e}. Falling back to local search.")
                # Fallback to local search
                return self._local_search(query_vector, top_k)
        else:
            # Fallback to local search
            return self._local_search(query_vector, top_k)
    
    def _local_search(self, query_vector, top_k=5):
        """Local search using cosine similarity"""
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