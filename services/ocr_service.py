import pytesseract
from PIL import Image
import cv2
import numpy as np
import os
import re

class OCRService:
    def __init__(self):
        # Configure Tesseract path if needed
        try:
            # For Linux, Tesseract is usually in PATH
            pytesseract.get_tesseract_version()
        except Exception as e:
            print(f"Warning: Tesseract not found in PATH. Error: {e}")
            # You may need to set the path manually on some systems
            # pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
    
    def preprocess_image(self, image):
        """Preprocess image for better OCR results"""
        # Convert to numpy array if it's a PIL Image
        if isinstance(image, Image.Image):
            image = np.array(image)
        
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Apply noise reduction
        denoised = cv2.medianBlur(gray, 3)
        
        # Apply thresholding to get binary image
        _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Apply morphological operations to clean up the image
        kernel = np.ones((1, 1), np.uint8)
        cleaned = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        
        return cleaned
    
    def extract_text(self, image_path=None, image_data=None):
        """Extract text from image using OCR"""
        try:
            if image_path:
                # Load image from file path
                image = Image.open(image_path)
            elif image_data:
                # Load image from file data
                image = Image.open(image_data)
            else:
                raise ValueError("Either image_path or image_data must be provided")
            
            # Preprocess the image
            processed_image = self.preprocess_image(image)
            
            # Extract text using Tesseract
            text = pytesseract.image_to_string(processed_image)
            
            # Clean the extracted text
            cleaned_text = self.clean_extracted_text(text)
            
            return {
                'success': True,
                'extracted_text': cleaned_text,
                'raw_text': text
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
        if readable_chars / len(text) < 0.5:
            return False, "Query contains too many non-readable characters"
        
        return True, "Valid query"