from typing import BinaryIO, Dict

from PIL import Image


class EasyOCRBackend:
	"""easyocr based ocr backend"""
	def __init__(self):
		try:
			import easyocr  # noqa: F401
			self.reader = easyocr.Reader(['en'])
			self.available = True
		except Exception as e:
			print(f"warning: easyocr not available: {e}")
			self.reader = None
			self.available = False

	def extract(self, image_path: str | None = None, image_data: BinaryIO | None = None) -> Dict:
		"""extract text with easyocr"""
		if not self.available:
			return {"success": False, "error": "easyocr unavailable", "extracted_text": "", "raw_text": ""}
		try:
			if image_path:
				image = Image.open(image_path)
			elif image_data:
				image = Image.open(image_data)
			else:
				raise ValueError("provide image_path or image_data")
			if image.mode != 'RGB':
				image = image.convert('RGB')
			results = self.reader.readtext(image)
			texts = [text for (_bbox, text, conf) in results if conf > 0.5]
			full_text = ' '.join(texts)
			return {"success": True, "extracted_text": full_text, "raw_text": full_text}
		except Exception as e:
			return {"success": False, "error": str(e), "extracted_text": "", "raw_text": ""}

