from typing import Any, Dict, Optional
from services.ocr.easyocr_backend import EasyOCRBackend
from services.ocr.google_vision_backend import GoogleVisionBackend
from services.ocr.text_utils import clean_extracted_text, validate_query


class OCRService:
    """simple ocr orchestration"""
    def __init__(self) -> None:
        self.google = GoogleVisionBackend()
        self.easy = EasyOCRBackend()
    
    def extract_text(self, image_path: Optional[str] = None, image_data: Optional[bytes] = None) -> Dict[str, Any]:
        """extract text from image"""
        if getattr(self.google, 'available', False):
            result = self.google.extract(image_path, image_data)
            if result.get('success'):
                result['extracted_text'] = clean_extracted_text(result.get('extracted_text', ''))
                return result
        if getattr(self.easy, 'available', False):
            result = self.easy.extract(image_path, image_data)
            if result.get('success'):
                result['extracted_text'] = clean_extracted_text(result.get('extracted_text', ''))
                return result
        return {'success': False, 'error': 'no ocr service available', 'extracted_text': '', 'raw_text': ''}
    
    def clean_extracted_text(self, text: str) -> str:
        return clean_extracted_text(text)
    
    def validate_query(self, text: str) -> bool:
        return validate_query(text)