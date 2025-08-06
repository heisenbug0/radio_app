#!/usr/bin/env python3
"""
Web Scraping Script for Task 5
Scrapes product images from e-commerce websites for training data
"""

import os
import sys
from services.web_scraping import WebScrapingService

def main():
    print("Starting Web Scraping for Product Images (Task 5)")
    print("=" * 50)
    
    # Initialize web scraping service
    scraper = WebScrapingService()
    
    try:
        # Path to the CSV file with product stock codes
        csv_file_path = "data/CNN_Model_Train_Data.csv"
        
        if not os.path.exists(csv_file_path):
            print(f"Error: CSV file not found at {csv_file_path}")
            return
        
        print(f"Found CSV file with product data: {csv_file_path}")
        
        # Scrape images for each product (5 images per product)
        results = scraper.scrape_product_images(csv_file_path, images_per_product=5)
        
        if not results.empty:
            print(f"\nScraping completed successfully!")
            print(f"Total images downloaded: {len(results)}")
            print(f"Results saved to: {os.path.join(scraper.download_dir, 'scraping_results.csv')}")
            
            # Show summary by product
            product_counts = results['stock_code'].value_counts()
            print(f"\nImages per product:")
            for product, count in product_counts.items():
                print(f"  {product}: {count} images")
        else:
            print("No images were downloaded. Check the scraping logs above.")
    
    except Exception as e:
        print(f"Error during scraping: {e}")
    
    finally:
        # Clean up resources
        scraper.cleanup()
        print("\nWeb scraping completed.")

if __name__ == "__main__":
    main()