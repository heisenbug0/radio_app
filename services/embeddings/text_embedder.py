import numpy as np
from typing import List
from sentence_transformers import SentenceTransformer


class TextEmbedder:
	"""small wrapper around sentence-transformers"""
	def __init__(self, model_name: str = 'sentence-transformers/all-mpnet-base-v2') -> None:
		self.model = SentenceTransformer(model_name)

	def encode(self, texts: List[str]) -> np.ndarray:
		"""encode texts to dense vectors"""
		return self.model.encode(texts, show_progress_bar=False, convert_to_numpy=True)

