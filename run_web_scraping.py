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
        # Path to the CSV file with product stock codes
        csv_file_path = "data/CNN_Model_Train_Data.csv"
        
        if not os.path.exists(csv_file_path):
            print(f"Error: CSV file not found at {csv_file_path}")
            return
        
        print(f"Found CSV file with product data: {csv_file_path}")
        
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
            for product, count in product_counts.items():
                print(f"  {product}: {count} images")
            
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