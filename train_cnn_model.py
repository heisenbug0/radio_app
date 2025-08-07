#!/usr/bin/env python3
"""
CNN Model Training Script (Enhanced for 90%+ Accuracy)
"""

import os
from services.cnn_model import CNNModelService

def main():
    print("CNN Model Training (Enhanced for 90%+ Accuracy)")
    print("=" * 60)
    
    # Initialize CNN service
    cnn_service = CNNModelService()
    
    try:
        # Check if data directory exists
        data_dir = "data/scraped_images"
        if not os.path.exists(data_dir):
            print(f"Error: Data directory not found at {data_dir}")
            print("Please run web scraping first:")
            print("  python run_web_scraping.py")
            return
        
        # Check for recommended dataset first, then fallback to original
        csv_file_path = "data/CNN_Model_Train_Data_recommended.csv"
        if not os.path.exists(csv_file_path):
            print("Recommended dataset not found, checking for original...")
            csv_file_path = "data/CNN_Model_Train_Data.csv"
        
        if not os.path.exists(csv_file_path):
            print(f"Error: No dataset file found!")
            print("Please create a comprehensive dataset:")
            print("  python create_comprehensive_dataset.py")
            return
        
        print(f"Found dataset file: {csv_file_path}")
        
        # Count images
        image_count = 0
        for filename in os.listdir(data_dir):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                image_count += 1
        
        print(f"Found {image_count} images for training")
        
        # Count products in dataset
        import pandas as pd
        df = pd.read_csv(csv_file_path)
        num_products = len(df)
        print(f"Dataset contains {num_products} products")
        
        # Provide guidance based on dataset size
        if num_products < 50:
            print("\n⚠️  Warning: Small dataset detected!")
            print("For 90%+ accuracy, you should have:")
            print("  - At least 200 products")
            print("  - At least 20 images per product")
            print("  - Total of 4,000+ images")
            print("\nConsider:")
            print("  1. Creating a larger dataset: python create_comprehensive_dataset.py")
            print("  2. Running web scraping again with more products")
            print("  3. Using the recommended dataset (500 products)")
        elif num_products < 200:
            print("\n⚠️  Medium dataset detected!")
            print("For optimal 90%+ accuracy, consider:")
            print("  - Using the recommended dataset (500 products)")
            print("  - Ensuring at least 15 images per product")
        else:
            print(f"\n✅ Good dataset size detected ({num_products} products)")
            print("This should provide excellent training data for 90%+ accuracy")
        
        if image_count < 1000:
            print(f"\n⚠️  Low image count detected ({image_count} images)")
            print("For 90%+ accuracy, you should have:")
            print("  - At least 1,000 images")
            print("  - At least 10 images per product")
            print("\nConsider running web scraping again to get more images")
        
        print(f"\nStarting enhanced model training...")
        print("This will use transfer learning with EfficientNetB3")
        print("Expected training time: 2-3 hours")
        print("Target accuracy: 90%+")
        
        # Train the model
        history = cnn_service.train_model(data_dir, csv_file_path)
        
        print("\n🎉 Enhanced CNN training completed!")
        print("Check the models/ directory for:")
        print("  - product_cnn_model.h5 (saved model)")
        print("  - training_history.png (training plots)")
        print("  - confusion_matrix.png (performance analysis)")
        
        # Provide next steps
        print("\nNext steps:")
        print("1. Test the model with new images")
        print("2. Monitor validation accuracy (should be >90%)")
        print("3. If accuracy is low, consider:")
        print("   - Collecting more training data")
        print("   - Using a larger dataset: python create_comprehensive_dataset.py")
        print("   - Adjusting model parameters")
        print("   - Using ensemble methods")
        
    except Exception as e:
        print(f"Error during training: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()