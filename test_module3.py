#!/usr/bin/env python3
"""
Test script for Module 3: CNN Model Training and Product Recognition
"""

import os
import sys
from services.cnn_model import CNNModelService
from services.web_scraping import WebScrapingService

def test_web_scraping():
    """Test web scraping functionality"""
    print("Testing Web Scraping...")
    print("=" * 40)
    
    scraper = WebScrapingService()
    
    # Check if Pixabay API key is set
    if not getattr(scraper, 'pixabay_key', None):
        print("❌ PIXABAY_API_KEY not found in environment variables")
        print("Please set PIXABAY_API_KEY in your .env file")
        return False
    
    print("✅ Pixabay key found")
    
    # Check if CSV file exists
    csv_path = "data/CNN_Model_Train_Data.csv"
    if not os.path.exists(csv_path):
        print(f"❌ CSV file not found: {csv_path}")
        return False
    
    print("✅ CSV file found")
    
    # Test scraping with just 1 image per product (for testing)
    print("Testing image scraping (1 image per product)...")
    results = scraper.scrape_product_images(csv_path, images_per_product=1)
    
    if not results.empty:
        print(f"✅ Successfully scraped {len(results)} images")
        return True
    else:
        print("❌ No images were scraped")
        return False

def test_cnn_training():
    """Test CNN model training"""
    print("\nTesting CNN Model Training...")
    print("=" * 40)
    
    cnn_service = CNNModelService()
    
    # Check if scraped images exist
    data_dir = "data/scraped_images"
    if not os.path.exists(data_dir):
        print(f"❌ Scraped images directory not found: {data_dir}")
        print("Please run web scraping first")
        return False
    
    # Count images
    image_files = [f for f in os.listdir(data_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
    if len(image_files) < 5:
        print(f"❌ Not enough images for training: {len(image_files)} found")
        print("Need at least 5 images for effective training")
        return False
    
    print(f"✅ Found {len(image_files)} images for training")
    
    # Test data loading
    try:
        csv_path = "data/CNN_Model_Train_Data.csv"
        X, y = cnn_service.load_and_preprocess_data(data_dir, csv_path)
        print(f"✅ Successfully loaded {len(X)} images for {len(cnn_service.class_names)} classes")
        return True
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return False

def test_model_prediction():
    """Test model prediction (if model exists)"""
    print("\nTesting Model Prediction...")
    print("=" * 40)
    
    cnn_service = CNNModelService()
    
    # Check if model exists
    model_path = "models/product_cnn_model.h5"
    if not os.path.exists(model_path):
        print(f"❌ Model not found: {model_path}")
        print("Please train the model first")
        return False
    
    print("✅ Model found")
    
    # Test loading model
    try:
        cnn_service.load_model()
        print("✅ Model loaded successfully")
        
        # Test prediction with a sample image
        data_dir = "data/scraped_images"
        if os.path.exists(data_dir):
            image_files = [f for f in os.listdir(data_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
            if image_files:
                test_image = os.path.join(data_dir, image_files[0])
                result = cnn_service.predict_product(test_image)
                if result:
                    print(f"✅ Prediction successful: {result['predicted_class']} (confidence: {result['confidence']:.3f})")
                    return True
                else:
                    print("❌ Prediction failed")
                    return False
        
        print("✅ Model prediction test passed")
        return True
        
    except Exception as e:
        print(f"❌ Error testing model: {e}")
        return False

def main():
    """Run all Module 3 tests"""
    print("Module 3: CNN Model Training and Product Recognition")
    print("=" * 60)
    
    # Test 1: Web Scraping
    scraping_ok = test_web_scraping()
    
    # Test 2: CNN Training
    training_ok = test_cnn_training()
    
    # Test 3: Model Prediction
    prediction_ok = test_model_prediction()
    
    # Summary
    print("\n" + "=" * 60)
    print("MODULE 3 TEST SUMMARY")
    print("=" * 60)
    print(f"Web Scraping:     {'✅ PASS' if scraping_ok else '❌ FAIL'}")
    print(f"CNN Training:     {'✅ PASS' if training_ok else '❌ FAIL'}")
    print(f"Model Prediction: {'✅ PASS' if prediction_ok else '❌ FAIL'}")
    
    if scraping_ok and training_ok and prediction_ok:
        print("\n🎉 All Module 3 tests passed!")
        print("Your CNN model is ready for product recognition.")
    else:
        print("\n⚠️  Some tests failed. Please check the issues above.")
        
        if not scraping_ok:
            print("\nTo fix web scraping:")
            print("1. Get SerpAPI key from serpapi.com")
            print("2. Add SERPAPI_KEY to your .env file")
            print("3. Run: python run_web_scraping.py")
        
        if not training_ok:
            print("\nTo fix CNN training:")
            print("1. Ensure you have scraped images")
            print("2. Run: python train_cnn_model.py")
        
        if not prediction_ok:
            print("\nTo fix model prediction:")
            print("1. Train the model first")
            print("2. Ensure model files exist in models/ directory")

if __name__ == "__main__":
    main()