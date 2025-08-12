#!/usr/bin/env python3
"""
setup for all services
"""

import os
import sys
from services.data_preparation import DataPreparationService
from services.ocr_service import OCRService
from services.cnn_model import CNNModelService
from services.web_scraping import WebScrapingService

def setup_data_preparation():
    """setup and test data preparation"""
    print("setting up data prep...")
    print("-" * 40)
    
    try:
        data_service = DataPreparationService()
        
        dataset_path = "data/dataset.csv"
        if os.path.exists(dataset_path):
            print("cleaning dataset...")
            cleaned_df = data_service.clean_dataset(dataset_path)
            print(f"ok: {len(cleaned_df)} products")
            
            print("creating product vectors...")
            vectors = data_service.create_product_vectors()
            print(f"ok: vectors {vectors.shape}")
            
            metrics = data_service.get_similarity_metrics()
            print(f"metric: {metrics['primary_metric']}")
            
            return data_service
        else:
            print("dataset not found; skip data prep")
            return None
            
    except Exception as e:
        print(f"data prep failed: {e}")
        return None

def setup_ocr_service():
    """setup and test ocr service"""
    print("\nsetting up ocr...")
    print("-" * 40)
    
    try:
        ocr_service = OCRService()
        print("ocr ready")
        
        test_result = ocr_service.extract_text(image_path=None, image_data=None)
        if test_result['success'] or "provide image_path" in test_result.get('error', ''):
            print("ocr basic check ok")
        else:
            print("ocr may have issues")
        
        return ocr_service
        
    except Exception as e:
        print(f"ocr setup failed: {e}")
        return None

def setup_cnn_service():
    """setup and test cnn service"""
    print("\nsetting up cnn...")
    print("-" * 40)
    
    try:
        cnn_service = CNNModelService()
        print("cnn ready")
        
        model_path = "models/product_cnn_model.h5"
        if os.path.exists(model_path):
            print("loading trained model...")
            cnn_service.load_model()
            print("model loaded")
        else:
            print("no trained model. run train_cnn_model.py")
        
        return cnn_service
        
    except Exception as e:
        print(f"cnn setup failed: {e}")
        return None

def setup_web_scraping():
    """setup and test web scraping"""
    print("\nsetting up web scraping...")
    print("-" * 40)
    
    try:
        scraper = WebScrapingService()
        print("web scraping ready")
        
        scraped_dir = "data/scraped_images"
        if os.path.exists(scraped_dir):
            image_files = [f for f in os.listdir(scraped_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
            print(f"found {len(image_files)} images")
        else:
            print("no scraped images. run run_web_scraping.py")
        
        return scraper
        
    except Exception as e:
        print(f"web scraping setup failed: {e}")
        return None

def main():
    print("setting up services")
    print("=" * 50)
    
    os.makedirs("data/scraped_images", exist_ok=True)
    os.makedirs("models", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    
    data_service = setup_data_preparation()
    ocr_service = setup_ocr_service()
    cnn_service = setup_cnn_service()
    web_scraper = setup_web_scraping()
    
    print("\n" + "=" * 50)
    print("summary")
    print("=" * 50)
    
    services_status = {
        "data prep": "ok" if data_service else "-",
        "ocr": "ok" if ocr_service else "-", 
        "cnn": "ok" if cnn_service else "-",
        "web scraping": "ok" if web_scraper else "-"
    }
    
    for service, status in services_status.items():
        print(f"{service}: {status}")
    
    print("\nnext:")
    if not data_service:
        print("- add data/dataset.csv")
    if not web_scraper:
        print("- set scraping api keys")
    if not cnn_service or not os.path.exists("models/product_cnn_model.h5"):
        print("- run: python run_web_scraping.py")
        print("- run: python train_cnn_model.py")
    
    print("\nstart app:")
    print("python app.py")

if __name__ == "__main__":
    main()