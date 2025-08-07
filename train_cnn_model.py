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
        
        # Check if CSV file exists
        csv_file_path = "data/CNN_Model_Train_Data.csv"
        if not os.path.exists(csv_file_path):
            print(f"Error: CSV file not found at {csv_file_path}")
            return
        
        print(f"Found scraped images directory: {data_dir}")
        print(f"Found product data CSV: {csv_file_path}")
        
        # Count images
        image_count = 0
        for filename in os.listdir(data_dir):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                image_count += 1
        
        print(f"Found {image_count} images for training")
        
        if image_count < 50:
            print("\n⚠️  Warning: Low image count detected!")
            print("For 90%+ accuracy, you should have:")
            print("  - At least 20 images per class")
            print("  - Total of 200+ images")
            print("\nConsider:")
            print("  1. Running web scraping again with more images")
            print("  2. Manual image collection for problematic classes")
            print("  3. Using data augmentation techniques")
        
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
        print("   - Adjusting model parameters")
        print("   - Using ensemble methods")
        
    except Exception as e:
        print(f"Error during training: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()