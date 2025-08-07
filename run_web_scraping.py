#!/usr/bin/env python3
"""
Web Scraping for Product Images (Task 5)
Enhanced version for optimal CNN training
"""

import os
import shutil
from services.web_scraping import WebScrapingService

def main():
    print("Starting Web Scraping for Product Images (Task 5)")
    print("=" * 50)
    print("Enhanced version for optimal CNN training")
    
    # Clean up existing images for fresh start
    data_dir = "data/scraped_images"
    if os.path.exists(data_dir):
        print(f"Cleaning up existing images in {data_dir}...")
        shutil.rmtree(data_dir)
        print("✅ Existing images removed")
    
    # Initialize web scraping service
    scraper = WebScrapingService()
    
    try:
        # Use the recommended dataset with 500 products
        csv_file_path = "data/CNN_Model_Train_Data_recommended.csv"
        
        # Fallback to original if recommended doesn't exist
        if not os.path.exists(csv_file_path):
            print(f"Recommended dataset not found, checking for original...")
            csv_file_path = "data/CNN_Model_Train_Data.csv"
        
        if not os.path.exists(csv_file_path):
            print(f"Error: No dataset file found!")
            print("Please run: python create_comprehensive_dataset.py")
            return
        
        print(f"Found dataset file: {csv_file_path}")
        
        # Count products in the dataset
        import pandas as pd
        df = pd.read_csv(csv_file_path)
        num_products = len(df)
        print(f"Dataset contains {num_products} products")
        
        if num_products < 50:
            print("\n⚠️  Warning: Small dataset detected!")
            print("For optimal CNN training, consider using a larger dataset:")
            print("  python create_comprehensive_dataset.py")
        
        # Scrape images for each product (15 images per product for optimal training)
        print("\nStarting enhanced image scraping...")
        print("Target: 15 images per product for optimal CNN training")
        print("This will use more API calls but give much better results!")
        
        results = scraper.scrape_product_images(csv_file_path, images_per_product=15)
        
        if not results.empty:
            print(f"\n🎉 Enhanced scraping completed successfully!")
            print(f"Total images downloaded: {len(results)}")
            print(f"Results saved to: {os.path.join(scraper.download_dir, 'scraping_results.csv')}")
            
            # Show summary by product
            product_counts = results['stock_code'].value_counts()
            print(f"\nImages per product:")
            for product, count in product_counts.head(20).items():
                print(f"  {product}: {count} images")
            
            if len(product_counts) > 20:
                print(f"  ... and {len(product_counts) - 20} more products")
            
            # Calculate statistics
            total_products = len(product_counts)
            avg_images = len(results) / total_products
            min_images = product_counts.min()
            max_images = product_counts.max()
            
            print(f"\n📊 Dataset Statistics:")
            print(f"  Total products: {total_products}")
            print(f"  Total images: {len(results)}")
            print(f"  Average images per product: {avg_images:.1f}")
            print(f"  Min images per product: {min_images}")
            print(f"  Max images per product: {max_images}")
            
            if avg_images >= 10:
                print(f"\n✅ Excellent dataset size! Ready for optimal CNN training.")
            elif avg_images >= 7:
                print(f"\n✅ Good dataset size! Should give good CNN results.")
            else:
                print(f"\n⚠️  Dataset size could be better. Consider re-scraping with more variations.")
                
        else:
            print("No images were downloaded. Check the scraping logs above.")
    
    except Exception as e:
        print(f"Error during enhanced scraping: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Clean up resources
        scraper.cleanup()
        print("\nEnhanced web scraping completed.")

if __name__ == "__main__":
    main()