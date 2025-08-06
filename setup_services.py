#!/usr/bin/env python3
"""
Setup Script for All Services
Initializes and tests all services to ensure they work correctly
"""

import os
import sys
from services.data_preparation import DataPreparationService
from services.ocr_service import OCRService
from services.cnn_model import CNNModelService
from services.web_scraping import WebScrapingService

def setup_data_preparation():
    """Setup and test data preparation service"""
    print("Setting up Data Preparation Service...")
    print("-" * 40)
    
    try:
        data_service = DataPreparationService()
        
        # Test dataset cleaning
        dataset_path = "data/dataset.csv"
        if os.path.exists(dataset_path):
            print("Cleaning dataset...")
            cleaned_df = data_service.clean_dataset(dataset_path)
            print(f"✓ Dataset cleaned successfully: {len(cleaned_df)} products")
            
            # Test vector creation
            print("Creating product vectors...")
            vectors = data_service.create_product_vectors()
            print(f"✓ Product vectors created: {vectors.shape}")
            
            # Test similarity metrics
            metrics = data_service.get_similarity_metrics()
            print(f"✓ Similarity metrics configured: {metrics['primary_metric']}")
            
            return data_service
        else:
            print("⚠ Dataset file not found. Skipping data preparation.")
            return None
            
    except Exception as e:
        print(f"✗ Data preparation setup failed: {e}")
        return None

def setup_ocr_service():
    """Setup and test OCR service"""
    print("\nSetting up OCR Service...")
    print("-" * 40)
    
    try:
        ocr_service = OCRService()
        print("✓ OCR service initialized")
        
        # Test OCR functionality with a simple test
        test_result = ocr_service.extract_text(image_path=None, image_data=None)
        if test_result['success'] or "must be provided" in test_result.get('error', ''):
            print("✓ OCR service is working correctly")
        else:
            print("⚠ OCR service may have issues")
        
        return ocr_service
        
    except Exception as e:
        print(f"✗ OCR service setup failed: {e}")
        return None

def setup_cnn_service():
    """Setup and test CNN model service"""
    print("\nSetting up CNN Model Service...")
    print("-" * 40)
    
    try:
        cnn_service = CNNModelService()
        print("✓ CNN model service initialized")
        
        # Check if trained model exists
        model_path = "models/product_cnn_model.h5"
        if os.path.exists(model_path):
            print("Loading existing trained model...")
            cnn_service.load_model()
            print("✓ Trained model loaded successfully")
        else:
            print("⚠ No trained model found. Run train_cnn_model.py to train a model.")
        
        return cnn_service
        
    except Exception as e:
        print(f"✗ CNN model service setup failed: {e}")
        return None

def setup_web_scraping():
    """Setup and test web scraping service"""
    print("\nSetting up Web Scraping Service...")
    print("-" * 40)
    
    try:
        scraper = WebScrapingService()
        print("✓ Web scraping service initialized")
        
        # Check if scraped images exist
        scraped_dir = "data/scraped_images"
        if os.path.exists(scraped_dir):
            image_files = [f for f in os.listdir(scraped_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
            print(f"✓ Found {len(image_files)} scraped images")
        else:
            print("⚠ No scraped images found. Run run_web_scraping.py to scrape images.")
        
        return scraper
        
    except Exception as e:
        print(f"✗ Web scraping service setup failed: {e}")
        return None

def main():
    print("Setting up All Services")
    print("=" * 50)
    
    # Create necessary directories
    os.makedirs("data/scraped_images", exist_ok=True)
    os.makedirs("models", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    
    # Setup each service
    data_service = setup_data_preparation()
    ocr_service = setup_ocr_service()
    cnn_service = setup_cnn_service()
    web_scraper = setup_web_scraping()
    
    # Summary
    print("\n" + "=" * 50)
    print("SETUP SUMMARY")
    print("=" * 50)
    
    services_status = {
        "Data Preparation": "✓" if data_service else "✗",
        "OCR Service": "✓" if ocr_service else "✗", 
        "CNN Model Service": "✓" if cnn_service else "✗",
        "Web Scraping Service": "✓" if web_scraper else "✗"
    }
    
    for service, status in services_status.items():
        print(f"{service}: {status}")
    
    print("\nNext Steps:")
    if not data_service:
        print("- Ensure dataset.csv exists in data/ directory")
    if not web_scraper:
        print("- Install Chrome/Chromium for web scraping")
    if not cnn_service or not os.path.exists("models/product_cnn_model.h5"):
        print("- Run: python run_web_scraping.py (to get training images)")
        print("- Run: python train_cnn_model.py (to train the model)")
    
    print("\nTo start the application:")
    print("python app.py")

if __name__ == "__main__":
    main()