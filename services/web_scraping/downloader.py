import hashlib
import logging
import random
from io import BytesIO
from typing import Dict, Optional

import requests
from PIL import Image

logger = logging.getLogger(__name__)


def download_and_validate(url: str, min_width: int, min_height: int) -> Optional[Dict]:
	try:
		headers = {"User-Agent": random.choice([
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			"Mozilla/5.0 (X11; Linux x86_64)"
		])}
		r = requests.get(url, headers=headers, timeout=18, stream=True)
		r.raise_for_status()
		content_type = r.headers.get("content-type", "")
		if not content_type or not content_type.startswith("image/"):
			logger.debug("Non-image content-type %s for url %s", content_type, url)
			return None
		data = r.content
		img = Image.open(BytesIO(data)).convert("RGB")
		w, hgt = img.size
		if w < min_width or hgt < min_height:
			logger.debug("Image too small %dx%d (min %dx%d) %s", w, hgt, min_width, min_height, url)
			return None
		fmt = (img.format or "").lower()
		ext = "jpg"
		if "png" in fmt:
			ext = "png"
		elif "webp" in fmt:
			ext = "webp"
		return {"bytes": data, "hash": hashlib.sha256(data).hexdigest(), "width": w, "height": hgt, "ext": ext}
	except Exception as e:
		logger.debug("Download/validate error for %s: %s", url, e)
		return None

