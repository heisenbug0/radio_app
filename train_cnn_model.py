#!/usr/bin/env python3
"""
CNN Model Training Script for Module 3
Trains the CNN using images in data/scraped_images and product list in data/CNN_Model_Train_Data.csv
"""

import os
from services.cnn_model import CNNModelService

def main():
    print("CNN Model Training (Optimized for Limited Data)")
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
        
        # Always use the original dataset list
        csv_file_path = "data/CNN_Model_Train_Data.csv"
        if not os.path.exists(csv_file_path):
            print("Error: data/CNN_Model_Train_Data.csv not found!")
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
        num_products = df['StockCode'].astype(str).nunique()
        print(f"Dataset contains {num_products} products")
        
        # Calculate average images per product
        avg_images_per_product = image_count / num_products if num_products > 0 else 0
        
        print(f"Average images per product: {avg_images_per_product:.1f}")
        
        # Provide guidance based on dataset size and image count
        print(f"\n📊 Dataset Analysis:")
        print(f"  Products: {num_products}")
        print(f"  Total images: {image_count}")
        print(f"  Images per product: {avg_images_per_product:.1f}")
        
        if num_products < 50:
            print(f"\n⚠️  Small dataset detected ({num_products} products)")
            print("For good CNN results with limited data:")
            print("  - Use heavy data augmentation")
            print("  - Train for more epochs")
            print("  - Use transfer learning (already implemented)")
            print("  - Consider ensemble methods")
        elif num_products < 100:
            print(f"\n⚠️  Medium dataset detected ({num_products} products)")
            print("This should work well with our enhanced training approach.")
        else:
            print(f"\n✅ Good dataset size detected ({num_products} products)")
        
        if avg_images_per_product < 3:
            print(f"\n⚠️  Low images per product ({avg_images_per_product:.1f})")
            print("Strategies for limited images:")
            print("  - Heavy data augmentation (already implemented)")
            print("  - Transfer learning (already implemented)")
            print("  - Longer training with early stopping")
            print("  - Cross-validation techniques")
        elif avg_images_per_product < 5:
            print(f"\n⚠️  Medium images per product ({avg_images_per_product:.1f})")
            print("This should work well with our training approach.")
        else:
            print(f"\n✅ Good images per product ({avg_images_per_product:.1f})")
            print("This should provide excellent training data!")
        
        # Check total image count
        if image_count < 200:
            print(f"\n⚠️  Low total image count ({image_count} images)")
            print("For optimal results, consider:")
            print("  - Using data augmentation (already implemented)")
            print("  - Training for more epochs")
            print("  - Using transfer learning (already implemented)")
        elif image_count < 500:
            print(f"\n⚠️  Medium total image count ({image_count} images)")
            print("This should work well with our enhanced training.")
        else:
            print(f"\n✅ Good total image count ({image_count} images)")
            print("This should provide excellent training data!")
        
        print(f"\nStarting optimized model training...")
        print("This will use transfer learning with EfficientNetB3")
        print("Expected training time: 1-2 hours")
        print("Target accuracy: 85%+ (with limited data)")
        
        # Train the model
        history = cnn_service.train_model(data_dir, csv_file_path)
        
        print("\n🎉 Optimized CNN training completed!")
        print("Check the models/ directory for:")
        print("  - high_accuracy_cnn_model.h5 (saved model)")
        print("  - training_history.png (training plots)")
        print("  - confusion_matrix.png (performance analysis)")
        
        # Provide next steps
        print("\nNext steps:")
        print("1. Test the model with new images")
        print("2. Monitor validation accuracy (should be >85% with limited data)")
        print("3. If accuracy is low, consider:")
        print("   - Collecting more training data")
        print("   - Using a different dataset size")
        print("   - Adjusting data augmentation parameters")
        print("   - Using ensemble methods")
        
    except Exception as e:
        print(f"Error during training: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()