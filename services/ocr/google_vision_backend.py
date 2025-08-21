from typing import BinaryIO, Dict
from services.ocr.text_utils import preprocess_handwriting_image


class GoogleVisionBackend:
	"""google cloud vision based ocr backend"""
	def __init__(self):
		try:
			from google.cloud import vision  # noqa: F401
			self.client = vision.ImageAnnotatorClient()
			self.available = True
		except Exception as e:
			print(f"warning: google vision not available: {e}")
			print("set GOOGLE_APPLICATION_CREDENTIALS if you want to use it")
			self.available = False
			self.client = None

	def extract(self, image_path: str | None = None, image_data: BinaryIO | None = None) -> Dict:
		"""extract text with google vision"""
		if not self.available:
			return {"success": False, "error": "google vision unavailable", "extracted_text": "", "raw_text": ""}
		try:
			from google.cloud import vision
			if image_path:
				from PIL import Image
				image = Image.open(image_path)
			elif image_data:
				from PIL import Image
				image = Image.open(image_data)
			else:
				raise ValueError("provide image_path or image_data")
			# handwriting-friendly preprocessing
			image = preprocess_handwriting_image(image)
			import io
			buf = io.BytesIO()
			image.save(buf, format='PNG')
			content = buf.getvalue()
			vision_image = vision.Image(content=content)
			response = self.client.text_detection(image=vision_image)
			if response.error and response.error.message:
				return {"success": False, "error": response.error.message, "extracted_text": "", "raw_text": ""}
			texts = response.text_annotations
			full_text = texts[0].description if texts else ""
			return {"success": True, "extracted_text": full_text, "raw_text": full_text}
		except Exception as e:
			return {"success": False, "error": str(e), "extracted_text": "", "raw_text": ""}

