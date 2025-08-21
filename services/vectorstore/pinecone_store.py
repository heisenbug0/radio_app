import os
from typing import List, Dict, Any


def init_pinecone() -> Any:
	try:
		api_key = os.getenv('PINECONE_API_KEY')
		if not api_key:
			print("warning: no pinecone api key, using local search")
			return None
		from pinecone import Pinecone, ServerlessSpec
		pc = Pinecone(api_key=api_key)
		index_name = "product-recommendations"
		# create if needed
		try:
			listed = pc.list_indexes()
		names = set()
			if isinstance(listed, list):
				for it in listed:
					name = getattr(it, 'name', it) if not isinstance(it, dict) else it.get('name')
					if name: names.add(name)
			elif isinstance(listed, dict):
				for it in listed.get('indexes', []):
					if isinstance(it, dict) and 'name' in it:
						names.add(it['name'])
			if index_name not in names:
				cloud = os.getenv('PINECONE_CLOUD', 'aws')
				region = os.getenv('PINECONE_REGION', 'us-east-1')
				pc.create_index(name=index_name, dimension=768, metric="cosine", spec=ServerlessSpec(cloud=cloud, region=region))
		return pc.Index(index_name)
	except Exception as e:
		print(f"warning: pinecone init failed: {e}; using local search")
		return None


def upsert_vectors(index, ids_vectors_metadata: List[tuple]) -> None:
	if not index:
		return
	batch_size = 100
	for i in range(0, len(ids_vectors_metadata), batch_size):
		index.upsert(vectors=ids_vectors_metadata[i:i+batch_size])


def query_vectors(index, vector: list, top_k: int = 5) -> List[Dict]:
	if not index:
		return []
	res = index.query(vector=vector, top_k=top_k, include_metadata=True)
	products = []
	for m in res.matches:
		products.append({
			'stock_code': m.metadata['stock_code'],
			'description': m.metadata['description'],
			'unit_price': m.metadata['unit_price'],
			'quantity': m.metadata['quantity'],
			'similarity_score': m.score,
		})
	return products

