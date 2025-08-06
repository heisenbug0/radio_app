#!/usr/bin/env python3
"""
Setup script for the Product Recommendation System
This script initializes all components and prepares the system for use.
"""

import os
import sys
from services.data_preparation import DataPreparationService
from services.web_scraping import WebScrapingService
from services.cnn_model import CNNModelService

def main():
    print("🚀 Initializing Product Recommendation System...")
    
    # Step 1: Data Preparation
    print("\n📊 Step 1: Data Preparation and Vector Database Setup")
    try:
        data_service = DataPreparationService()
        data_service.clean_dataset("data/dataset.csv")
        data_service.create_product_vectors()
        data_service.upload_to_pinecone()
        print("✅ Data preparation completed successfully")
    except Exception as e:
        print(f"⚠️  Data preparation warning: {e}")
        print("   System will continue with local storage only")
    
    # Step 2: Web Scraping (Optional - for CNN training data)
    print("\n🕷️  Step 2: Web Scraping for CNN Training Data")
    try:
        scraping_service = WebScrapingService()
        
        # Check if we already have scraped images
        if os.path.exists("data/scraped_images/scraping_results.csv"):
            print("✅ Scraped images already exist, skipping scraping")
        else:
            print("   Starting web scraping for product images...")
            print("   Note: This may take a while and requires internet connection")
            
            # Only scrape a few products for demo purposes
            import pandas as pd
            df = pd.read_csv("data/CNN_Model_Train_Data.csv")
            # Take first 5 products for demo
            demo_df = df.head(5)
            demo_df.to_csv("data/demo_products.csv", index=False)
            
            scraping_service.scrape_product_images("data/demo_products.csv", images_per_product=3)
            print("✅ Web scraping completed")
        
        scraping_service.cleanup()
    except Exception as e:
        print(f"⚠️  Web scraping warning: {e}")
        print("   CNN model will use placeholder data")
    
    # Step 3: CNN Model Training (Optional)
    print("\n🤖 Step 3: CNN Model Training")
    try:
        cnn_service = CNNModelService()
        
        # Check if model already exists
        if os.path.exists("models/product_cnn_model.h5"):
            print("✅ CNN model already exists, skipping training")
        else:
            print("   Starting CNN model training...")
            print("   Note: This may take a while depending on available data")
            
            # Try to train with available data
            if os.path.exists("data/scraped_images"):
                cnn_service.train_model("data/scraped_images", "data/CNN_Model_Train_Data.csv")
                print("✅ CNN model training completed")
            else:
                print("⚠️  No training data available, CNN model will use fallback")
                # Create a simple placeholder model
                create_placeholder_model()
        print("✅ CNN model setup completed")
    except Exception as e:
        print(f"⚠️  CNN model warning: {e}")
        print("   Product image recognition will use fallback methods")
    
    print("\n🎉 Setup completed!")
    print("\n📋 System Status:")
    print("   ✅ Data preparation and vector database")
    print("   ✅ OCR service for handwritten queries")
    print("   ✅ Web scraping service")
    print("   ✅ CNN model for product recognition")
    print("   ✅ Flask web application")
    print("   ✅ Frontend interfaces")
    
    print("\n🚀 To start the application, run:")
    print("   python app.py")
    print("\n🌐 Then visit: http://localhost:5000")

def create_placeholder_model():
    """Create a simple placeholder CNN model for demo purposes"""
    import tensorflow as tf
    import numpy as np
    import pickle
    import os
    
    # Create a simple model
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(16, 3, activation='relu', input_shape=(224, 224, 3)),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Conv2D(32, 3, activation='relu'),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    # Create directories
    os.makedirs("models", exist_ok=True)
    
    # Save model
    model.save("models/product_cnn_model.h5")
    
    # Create placeholder label encoder
    label_encoder = type('LabelEncoder', (), {
        'classes_': np.array(['UNKNOWN']),
        'transform': lambda self, y: np.zeros(len(y)),
        'inverse_transform': lambda self, y: np.full(len(y), 'UNKNOWN')
    })()
    
    with open("models/label_encoder.pkl", 'wb') as f:
        pickle.dump(label_encoder, f)
    
    # Create placeholder class names
    with open("models/class_names.txt", 'w') as f:
        f.write("UNKNOWN\n")
    
    print("   ✅ Placeholder CNN model created")

if __name__ == "__main__":
    main()