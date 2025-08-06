import os
from PIL import Image
import io
import re

class OCRService:
    def __init__(self):
        # Initialize Google Cloud Vision client
        try:
            from google.cloud import vision
            self.client = vision.ImageAnnotatorClient()
            self.use_google_vision = True
            print("Google Cloud Vision API initialized successfully")
        except Exception as e:
            print(f"Warning: Google Cloud Vision not available: {e}")
            print("Please set GOOGLE_APPLICATION_CREDENTIALS environment variable")
            self.use_google_vision = False
            self.client = None
        
        # Initialize EasyOCR as fallback
        try:
            import easyocr
            self.reader = easyocr.Reader(['en'])
            self.use_easyocr = True
            print("EasyOCR fallback initialized successfully")
        except Exception as e:
            print(f"Warning: EasyOCR not available: {e}")
            self.use_easyocr = False
            self.reader = None
    
    def extract_text(self, image_path=None, image_data=None):
        """Extract text from image using Google Cloud Vision API with EasyOCR fallback"""
        # Try Google Cloud Vision first
        if self.use_google_vision:
            result = self._extract_with_google_vision(image_path, image_data)
            if result['success']:
                return result
        
        # Fallback to EasyOCR
        if self.use_easyocr:
            result = self._extract_with_easyocr(image_path, image_data)
            if result['success']:
                return result
        
        # No OCR available
        return {
            'success': False,
            'error': 'No OCR service available. Please set up Google Cloud Vision API or install EasyOCR.',
            'extracted_text': '',
            'raw_text': ''
        }
    
    def _extract_with_google_vision(self, image_path=None, image_data=None):
        """Extract text using Google Cloud Vision API"""
        try:
            # Load image
            if image_path:
                with open(image_path, 'rb') as image_file:
                    content = image_file.read()
            elif image_data:
                content = image_data.read()
            else:
                raise ValueError("Either image_path or image_data must be provided")
            
            # Create image object
            from google.cloud import vision
            image = vision.Image(content=content)
            
            # Perform text detection
            response = self.client.text_detection(image=image)
            
            if response.error.message:
                return {
                    'success': False,
                    'error': response.error.message,
                    'extracted_text': '',
                    'raw_text': ''
                }
            
            # Extract text from response
            texts = response.text_annotations
            
            if not texts:
                return {
                    'success': True,
                    'extracted_text': '',
                    'raw_text': ''
                }
            
            # Get the full text (first element contains all text)
            full_text = texts[0].description
            raw_text = full_text
            
            # Clean and normalize the extracted text
            cleaned_text = self.clean_extracted_text(full_text)
            
            return {
                'success': True,
                'extracted_text': cleaned_text,
                'raw_text': raw_text
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'extracted_text': '',
                'raw_text': ''
            }
    
    def _extract_with_easyocr(self, image_path=None, image_data=None):
        """Extract text using EasyOCR as fallback"""
        try:
            # Load image
            if image_path:
                image = Image.open(image_path)
            elif image_data:
                image = Image.open(image_data)
            else:
                raise ValueError("Either image_path or image_data must be provided")
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Perform OCR
            results = self.reader.readtext(image)
            
            # Extract text from results
            texts = []
            for (bbox, text, confidence) in results:
                if confidence > 0.5:  # Only include high-confidence results
                    texts.append(text)
            
            full_text = ' '.join(texts)
            raw_text = full_text
            
            # Clean and normalize the extracted text
            cleaned_text = self.clean_extracted_text(full_text)
            
            return {
                'success': True,
                'extracted_text': cleaned_text,
                'raw_text': raw_text
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'extracted_text': '',
                'raw_text': ''
            }
    
    def clean_extracted_text(self, text):
        """Clean and normalize extracted text"""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize
        cleaned = re.sub(r'\s+', ' ', text.strip())
        
        # Remove special characters that might be OCR artifacts
        cleaned = re.sub(r'[^\w\s\-.,!?]', '', cleaned)
        
        # Convert to lowercase for consistency
        cleaned = cleaned.lower()
        
        # Common OCR corrections for modern OCR
        corrections = {
            '0': 'o',  # Common OCR mistake
            '1': 'l',  # Common OCR mistake
            '5': 's',  # Common OCR mistake
            '8': 'b',  # Common OCR mistake
            'rn': 'm',  # Common OCR mistake
            'cl': 'd',  # Common OCR mistake
        }
        
        for wrong, correct in corrections.items():
            cleaned = cleaned.replace(wrong, correct)
        
        return cleaned
    
    def validate_query(self, text):
        """Validate if the extracted text is a reasonable query"""
        if not text or len(text.strip()) < 2:
            return False, "Query too short"
        
        # Check for common OCR artifacts
        if len(text) > 500:
            return False, "Query too long"
        
        # Check if text contains mostly readable characters
        readable_chars = sum(1 for c in text if c.isalnum() or c.isspace())
        if readable_chars / len(text) < 0.3:  # Lowered threshold for handwriting
            return False, "Query contains too many non-readable characters"
        
        return True, "Valid query"