#!/usr/bin/env python3
"""
CNN Model Training Script for Task 6
Trains a CNN model from scratch using scraped product images
"""

import os
import sys
from services.cnn_model import CNNModelService

def main():
    print("Starting CNN Model Training (Task 6)")
    print("=" * 50)
    
    # Initialize CNN model service
    cnn_service = CNNModelService()
    
    try:
        # Paths to data
        data_dir = "data/scraped_images"
        csv_file_path = "data/CNN_Model_Train_Data.csv"
        
        # Check if required files exist
        if not os.path.exists(data_dir):
            print(f"Error: Scraped images directory not found at {data_dir}")
            print("Please run the web scraping script first: python run_web_scraping.py")
            return
        
        if not os.path.exists(csv_file_path):
            print(f"Error: CSV file not found at {csv_file_path}")
            return
        
        print(f"Found scraped images directory: {data_dir}")
        print(f"Found product data CSV: {csv_file_path}")
        
        # Check if there are enough images for training
        image_files = [f for f in os.listdir(data_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
        if len(image_files) < 10:
            print(f"Warning: Only {len(image_files)} images found. Training may not be effective.")
            print("Consider running web scraping to get more images.")
        
        print(f"Found {len(image_files)} images for training")
        
        # Train the model
        print("\nStarting model training...")
        history = cnn_service.train_model(data_dir, csv_file_path)
        
        print("\nModel training completed successfully!")
        print("Model saved to: models/product_cnn_model.h5")
        print("Training history plot saved to: training_history.png")
        
        # Show final metrics
        if history:
            final_accuracy = history.history['accuracy'][-1]
            final_val_accuracy = history.history['val_accuracy'][-1]
            print(f"\nFinal Training Accuracy: {final_accuracy:.4f}")
            print(f"Final Validation Accuracy: {final_val_accuracy:.4f}")
    
    except Exception as e:
        print(f"Error during model training: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()