#!/usr/bin/env python3
"""
Simple OCR test script to verify OCR functionality
"""

import os
import sys
from services.ocr_service import OCRService

def test_ocr_with_image(image_path):
    """Test OCR with a specific image"""
    if not os.path.exists(image_path):
        print(f"Error: Image file {image_path} not found")
        return
    
    print(f"Testing OCR with image: {image_path}")
    print("=" * 50)
    
    ocr_service = OCRService()
    
    # Test OCR extraction
    result = ocr_service.extract_text(image_path=image_path)
    
    if result['success']:
        print("✓ OCR extraction successful")
        print(f"Extracted text: '{result['extracted_text']}'")
        print(f"Raw text: '{result['raw_text']}'")
        
        # Show all attempts
        if 'all_attempts' in result:
            print("\nAll OCR attempts:")
            for i, attempt in enumerate(result['all_attempts'], 1):
                print(f"  Attempt {i}: '{attempt}'")
        
        # Validate the result
        is_valid, validation_message = ocr_service.validate_query(result['extracted_text'])
        print(f"\nValidation: {validation_message}")
        
        if is_valid:
            print("✓ Text validation passed")
        else:
            print("✗ Text validation failed")
            
    else:
        print("✗ OCR extraction failed")
        print(f"Error: {result['error']}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python test_ocr.py <image_path>")
        print("Example: python test_ocr.py test_image.jpg")
        return
    
    image_path = sys.argv[1]
    test_ocr_with_image(image_path)

if __name__ == "__main__":
    main()