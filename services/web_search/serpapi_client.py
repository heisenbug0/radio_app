import os
import requests
import logging

logger = logging.getLogger(__name__)


class SerpApiClient:
	def __init__(self, api_key: str | None = None):
		self.api_key = api_key or os.getenv("SERPAPI_API_KEY")

	def search_images(self, query: str, num: int):
		if not self.api_key:
			logger.warning("SerpAPI key missing.")
			return []
		params = {"engine": "google", "q": query, "tbm": "isch", "num": num, "api_key": self.api_key}
		try:
			r = requests.get("https://serpapi.com/search.json", params=params, timeout=15)
			if r.status_code != 200:
				logger.warning("SerpAPI returned %s: %s", r.status_code, r.text[:300])
				return []
			data = r.json()
			hits = data.get("images_results") or data.get("image_results") or data.get("inline_images") or []
			images = []
			for h in hits:
				url = h.get("original") or h.get("origin") or h.get("link") or h.get("thumbnail")
				title = h.get("title") or h.get("alt") or h.get("snippet") or ""
				width = h.get("width") or 0
				height = h.get("height") or 0
				if url:
					images.append({"url": url, "title": title, "width": width, "height": height})
			return images
		except Exception as e:
			logger.exception("SerpAPI search error: %s", e)
			return []

