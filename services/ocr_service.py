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
    
    def preprocess_for_handwriting(self, image):
        """Special preprocessing for handwriting recognition"""
        # Convert to numpy array if it's a PIL Image
        if isinstance(image, Image.Image):
            image = np.array(image)
        
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply adaptive thresholding for better handwriting
        adaptive_thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        # Apply morphological operations
        kernel = np.ones((2, 2), np.uint8)
        processed = cv2.morphologyEx(adaptive_thresh, cv2.MORPH_CLOSE, kernel)
        
        return processed
    
    def preprocess_for_low_contrast(self, image):
        """Preprocessing for low contrast images"""
        # Convert to numpy array if it's a PIL Image
        if isinstance(image, Image.Image):
            image = np.array(image)
        
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Apply histogram equalization to improve contrast
        equalized = cv2.equalizeHist(gray)
        
        # Apply bilateral filter to reduce noise while preserving edges
        filtered = cv2.bilateralFilter(equalized, 9, 75, 75)
        
        # Apply Otsu thresholding
        _, binary = cv2.threshold(filtered, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return binary
    
    def preprocess_for_small_text(self, image):
        """Preprocessing for small text"""
        # Convert to numpy array if it's a PIL Image
        if isinstance(image, Image.Image):
            image = np.array(image)
        
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Scale up the image for better OCR
        height, width = gray.shape
        scale_factor = 2
        scaled = cv2.resize(gray, (width * scale_factor, height * scale_factor), interpolation=cv2.INTER_CUBIC)
        
        # Apply sharpening filter
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        sharpened = cv2.filter2D(scaled, -1, kernel)
        
        # Apply thresholding
        _, binary = cv2.threshold(sharpened, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return binary
    
    def extract_text(self, image_path=None, image_data=None):
        """Extract text from image using OCR with multiple attempts"""
        try:
            if image_path:
                # Load image from file path
                image = Image.open(image_path)
            elif image_data:
                # Load image from file data
                image = Image.open(image_data)
            else:
                raise ValueError("Either image_path or image_data must be provided")
            
            # Try multiple preprocessing methods and OCR configurations
            results = []
            
            # Method 1: Standard preprocessing
            processed_image = self.preprocess_image(image)
            text1 = pytesseract.image_to_string(processed_image, config='--psm 6')
            results.append(text1)
            
            # Method 2: Handwriting-optimized preprocessing
            processed_handwriting = self.preprocess_for_handwriting(image)
            text2 = pytesseract.image_to_string(processed_handwriting, config='--psm 6')
            results.append(text2)
            
            # Method 3: Try with different PSM modes for handwriting
            text3 = pytesseract.image_to_string(processed_handwriting, config='--psm 8')
            results.append(text3)
            
            # Method 4: Try with original image
            text4 = pytesseract.image_to_string(image, config='--psm 6')
            results.append(text4)
            
            # Method 5: Try with different threshold
            _, binary_alt = cv2.threshold(processed_handwriting, 127, 255, cv2.THRESH_BINARY)
            text5 = pytesseract.image_to_string(binary_alt, config='--psm 6')
            results.append(text5)
            
            # Method 6: Low contrast preprocessing
            processed_low_contrast = self.preprocess_for_low_contrast(image)
            text6 = pytesseract.image_to_string(processed_low_contrast, config='--psm 6')
            results.append(text6)
            
            # Method 7: Small text preprocessing
            processed_small_text = self.preprocess_for_small_text(image)
            text7 = pytesseract.image_to_string(processed_small_text, config='--psm 6')
            results.append(text7)
            
            # Method 8: Try with different PSM modes for small text
            text8 = pytesseract.image_to_string(processed_small_text, config='--psm 8')
            results.append(text8)
            
            # Choose the best result based on length and quality
            best_text = self.select_best_result(results)
            
            # Clean the extracted text
            cleaned_text = self.clean_extracted_text(best_text)
            
            return {
                'success': True,
                'extracted_text': cleaned_text,
                'raw_text': best_text,
                'all_attempts': results
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'extracted_text': '',
                'raw_text': ''
            }
    
    def select_best_result(self, results):
        """Select the best OCR result from multiple attempts"""
        if not results:
            return ""
        
        # Filter out empty results
        valid_results = [r for r in results if r and r.strip()]
        
        if not valid_results:
            return ""
        
        # Score each result based on length and readability
        scored_results = []
        for text in valid_results:
            score = 0
            cleaned = self.clean_extracted_text(text)
            
            # Prefer longer results (but not too long)
            if 3 <= len(cleaned) <= 100:
                score += len(cleaned) * 2
            elif len(cleaned) > 100:
                # Penalize very long results
                score -= (len(cleaned) - 100) * 0.5
            
            # Prefer results with more alphanumeric characters
            alnum_ratio = sum(1 for c in cleaned if c.isalnum()) / max(len(cleaned), 1)
            score += alnum_ratio * 100
            
            # Prefer results with more words (likely to be actual text)
            word_count = len(cleaned.split())
            if 1 <= word_count <= 10:
                score += word_count * 5
            
            # Penalize results with too many special characters
            special_chars = sum(1 for c in cleaned if not c.isalnum() and not c.isspace())
            score -= special_chars * 2
            
            # Bonus for common words that might indicate a product query
            common_words = ['headphones', 'mouse', 'keyboard', 'laptop', 'phone', 'camera', 'book', 'pen', 'paper', 'desk', 'chair', 'table', 'light', 'fan', 'speaker', 'monitor', 'printer', 'scanner', 'wireless', 'bluetooth', 'usb', 'hdmi', 'cable', 'battery', 'charger']
            for word in common_words:
                if word in cleaned.lower():
                    score += 20
            
            # Penalize results that are mostly numbers or single characters
            if len(cleaned) > 0:
                digit_ratio = sum(1 for c in cleaned if c.isdigit()) / len(cleaned)
                if digit_ratio > 0.7:
                    score -= 50
                
                single_char_ratio = sum(1 for c in cleaned if len(c) == 1) / len(cleaned)
                if single_char_ratio > 0.8:
                    score -= 30
            
            scored_results.append((score, cleaned))
        
        # Return the result with the highest score
        if scored_results:
            scored_results.sort(key=lambda x: x[0], reverse=True)
            return scored_results[0][1]
        
        return valid_results[0] if valid_results else ""
    
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
        
        # Common OCR corrections for handwriting
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