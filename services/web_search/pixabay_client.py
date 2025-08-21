import logging
import os

import requests

logger = logging.getLogger(__name__)


class PixabayClient:
	def __init__(self, api_key: str | None = None):
		self.api_key = api_key or os.getenv("PIXABAY_API_KEY")

	def search_images(self, query: str, per_page: int):
		if not self.api_key:
			logger.warning("Pixabay key missing.")
			return []
		params = {"key": self.api_key, "q": query, "image_type": "photo", "per_page": per_page, "safesearch": "true", "order": "popular"}
		try:
			r = requests.get("https://pixabay.com/api/", params=params, timeout=15)
			if r.status_code != 200:
				logger.warning("Pixabay returned %s: %s", r.status_code, r.text[:300])
				return []
			data = r.json()
			hits = data.get("hits", [])
			images = []
			for h in hits:
				url = h.get("largeImageURL") or h.get("webformatURL") or h.get("previewURL")
				width = h.get("imageWidth") or h.get("webformatWidth") or 0
				height = h.get("imageHeight") or h.get("webformatHeight") or 0
				if url:
					images.append({"url": url, "title": h.get("tags", ""), "width": width, "height": height})
			return images
		except Exception as e:
			logger.exception("Pixabay search error: %s", e)
			return []

