#!/usr/bin/env python3
"""
Web Scraping for Product Images (Task 5)
Scrape images for ALL products listed in data/CNN_Model_Train_Data.csv.
Automatically allocates images-per-product based on available free API requests.
"""

import os
import shutil

from dotenv import load_dotenv
load_dotenv()

from services.web_scraping import WebScrapingService

def main():
    print("Starting Web Scraping for Product Images (Task 5)")
    print("=" * 50)
    print("Using Pixabay API")
    
    # Clean up existing images for fresh start
    data_dir = "data/scraped_images"
    if os.path.exists(data_dir):
        print(f"Cleaning up existing images in {data_dir}...")
        shutil.rmtree(data_dir)
        print("✅ Existing images removed")
    
    # Initialize web scraping service
    scraper = WebScrapingService()
    
    try:
        # Always use the original list of products
        csv_file_path = "data/CNN_Model_Train_Data.csv"

        if not os.path.exists(csv_file_path):
            print(f"Error: No dataset file found!")
            print("Please create an optimized dataset:")
            print("  python create_optimized_dataset.py")
            return
        
        print(f"Found dataset file: {csv_file_path}")
        
        # Count products in the dataset
        import pandas as pd
        df = pd.read_csv(csv_file_path)
        # Use unique stock codes to avoid duplicate scraping
        num_products = df['StockCode'].astype(str).nunique()
        print(f"Dataset contains {num_products} products")
        
        # Calculate optimal images per product based on Pixabay free limit
        max_api_requests = 5000  # Pixabay free tier guideline
        images_per_product = max(1, max_api_requests // max(1, num_products))
        # Put a sane cap so we don't over-download on very small datasets
        images_per_product = min(images_per_product, 10)
        
        print(f"\n📊 API Usage Plan:")
        print(f"  Total API requests available: {max_api_requests}")
        print(f"  Number of products: {num_products}")
        print(f"  Images per product: {images_per_product}")
        total_needed = num_products * images_per_product
        # Pixabay per_page minimum is 3, we request in chunks per variation
        print(f"  Total images to download: {total_needed}")
        print(f"  API requests needed: {total_needed}")
        
        if images_per_product < 2:
            print(f"\n⚠️  Warning: Only {images_per_product} image per product!")
            print("This may not be enough for good CNN training.")
            print("Consider using a smaller dataset for more images per product:")
            print("  - premium_50: 5 images per product")
            print("  - quality_83: 3 images per product")
            print("  - balanced_125: 2 images per product")
        elif images_per_product < 5:
            print(f"\n⚠️  Medium image count: {images_per_product} images per product")
            print("This should work for CNN training, but more images would be better.")
        else:
            print(f"\n✅ Good image count: {images_per_product} images per product")
            print("This should provide excellent training data!")
        
        # Scrape images for each product
        print(f"\nStarting optimized image scraping...")
        print(f"Target: {images_per_product} images per product")
        print(f"Total API requests: {num_products * images_per_product}")
        
        results = scraper.scrape_product_images(csv_file_path, images_per_product=images_per_product)
        
        if not results.empty:
            print(f"\n🎉 Optimized scraping completed successfully!")
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
            
            # Provide guidance based on results
            if avg_images >= 5:
                print(f"\n✅ Excellent dataset! Ready for optimal CNN training.")
            elif avg_images >= 3:
                print(f"\n✅ Good dataset! Should give good CNN results.")
            elif avg_images >= 2:
                print(f"\n⚠️  Adequate dataset. Consider:")
                print("   - Using data augmentation techniques")
                print("   - Training for more epochs")
                print("   - Using transfer learning")
            else:
                print(f"\n⚠️  Limited dataset. Consider:")
                print("   - Using a smaller product set for more images per product")
                print("   - Running scraping again with different parameters")
                print("   - Using heavy data augmentation")
                
        else:
            print("No images were downloaded. Check the scraping logs above.")
    
    except Exception as e:
        print(f"Error during optimized scraping: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Clean up resources
        scraper.cleanup()
        print("\nOptimized web scraping completed.")

if __name__ == "__main__":
    main()