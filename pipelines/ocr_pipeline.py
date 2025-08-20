from typing import Optional
from services.ocr_service import OCRService
from services.data_preparation import DataPreparationService
from utils.types import TextQueryResult


class OCRPipeline:
	def __init__(self, ocr_service: OCRService, data_service: DataPreparationService):
		self.ocr_service = ocr_service
		self.data_service = data_service

	def run(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None) -> TextQueryResult:
		res = self.ocr_service.extract_text(image_path=image_path, image_data=image_data)
		if not res.get("success"):
			return {"products": [], "response": f"ocr failed: {res.get('error','')}", "extracted_text": ""}

		text = (res.get("extracted_text") or "").strip()
		if not text:
			return {"products": [], "response": "no readable text", "extracted_text": ""}

		products = self.data_service.search_products(text, top_k=5)
		if not products:
			return {"products": [], "response": "no products found", "extracted_text": text}

		return {"products": products, "response": "results:", "extracted_text": text}

from typing import Optional
from services.ocr_service import OCRService
from services.data_preparation import DataPreparationService
from utils.types import TextQueryResult


class OCRPipeline:
	def __init__(self, ocr_service: OCRService, data_service: DataPreparationService):
		self.ocr_service = ocr_service
		self.data_service = data_service

	def run(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None) -> TextQueryResult:
		res = self.ocr_service.extract_text(image_path=image_path, image_data=image_data)
		if not res.get("success"):
			return {"products": [], "response": f"ocr failed: {res.get('error','')}", "extracted_text": ""}

		text = (res.get("extracted_text") or "").strip()
		if not text:
			return {"products": [], "response": "no readable text", "extracted_text": ""}

		products = self.data_service.search_products(text, top_k=5)
		if not products:
			return {"products": [], "response": "no products found", "extracted_text": text}

		return {"products": products, "response": "results:", "extracted_text": text}

