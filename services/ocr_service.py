import os
from PIL import Image
import io
import re

class OCRService:
    def __init__(self):
        # google cloud vision client
        try:
            from google.cloud import vision
            self.client = vision.ImageAnnotatorClient()
            self.use_google_vision = True
            print("google vision ready")
        except Exception as e:
            print(f"warning: google vision not available: {e}")
            print("set GOOGLE_APPLICATION_CREDENTIALS if you want to use it")
            self.use_google_vision = False
            self.client = None
        
        # easyocr fallback
        try:
            import easyocr
            self.reader = easyocr.Reader(['en'])
            self.use_easyocr = True
            print("easyocr ready")
        except Exception as e:
            print(f"warning: easyocr not available: {e}")
            self.use_easyocr = False
            self.reader = None
    
    def extract_text(self, image_path=None, image_data=None):
        """extract text from image"""
        # try google vision first
        if self.use_google_vision:
            result = self._extract_with_google_vision(image_path, image_data)
            if result['success']:
                return result
        
        # fallback to easyocr
        if self.use_easyocr:
            result = self._extract_with_easyocr(image_path, image_data)
            if result['success']:
                return result
        
        # no ocr available
        return {
            'success': False,
            'error': 'no ocr service available',
            'extracted_text': '',
            'raw_text': ''
        }
    
    def _extract_with_google_vision(self, image_path=None, image_data=None):
        """extract text using google vision"""
        try:
            # load image
            if image_path:
                with open(image_path, 'rb') as image_file:
                    content = image_file.read()
            elif image_data:
                content = image_data.read()
            else:
                raise ValueError("provide image_path or image_data")
            
            # create image object
            from google.cloud import vision
            image = vision.Image(content=content)
            
            # text detection
            response = self.client.text_detection(image=image)
            
            if response.error.message:
                return {
                    'success': False,
                    'error': response.error.message,
                    'extracted_text': '',
                    'raw_text': ''
                }
            
            # extract text from response
            texts = response.text_annotations
            
            if not texts:
                return {
                    'success': True,
                    'extracted_text': '',
                    'raw_text': ''
                }
            
            # full text is first element
            full_text = texts[0].description
            raw_text = full_text
            
            # clean and normalize
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
        """extract text using easyocr"""
        try:
            # load image
            if image_path:
                image = Image.open(image_path)
            elif image_data:
                image = Image.open(image_data)
            else:
                raise ValueError("provide image_path or image_data")
            
            # convert to rgb if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # ocr
            results = self.reader.readtext(image)
            
            # collect high confidence text
            texts = []
            for (bbox, text, confidence) in results:
                if confidence > 0.5:
                    texts.append(text)
            
            full_text = ' '.join(texts)
            raw_text = full_text
            
            # clean and normalize
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
        """clean and normalize text"""
        if not text:
            return ""
        
        # strip extra whitespace
        cleaned = re.sub(r'\s+', ' ', text.strip())
        
        # drop odd characters
        cleaned = re.sub(r'[^\w\s\-.,!?]', '', cleaned)
        
        # lowercase
        cleaned = cleaned.lower()
        
        # basic corrections
        corrections = {
            '0': 'o',
            '1': 'l',
            '5': 's',
            '8': 'b',
            'rn': 'm',
            'cl': 'd',
        }
        
        for wrong, correct in corrections.items():
            cleaned = cleaned.replace(wrong, correct)
        
        return cleaned
    
    def validate_query(self, text):
        """validate if text is a reasonable query"""
        if not text or len(text.strip()) < 2:
            return False, "Query too short"
        
        # length check
        if len(text) > 500:
            return False, "Query too long"
        
        # readability check
        readable_chars = sum(1 for c in text if c.isalnum() or c.isspace())
        if readable_chars / len(text) < 0.3:
            return False, "Query contains too many non-readable characters"
        
        return True, "Valid query"