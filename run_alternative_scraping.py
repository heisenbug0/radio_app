#!/usr/bin/env python3
"""
Alternative Web Scraping for Product Images
Uses APIs with more generous free tiers
"""

import os
import shutil
from services.web_scraping_alternative import AlternativeWebScrapingService

def main():
    print("Alternative Web Scraping for Product Images")
    print("=" * 50)
    print("Using APIs with more generous free tiers")
    
    # Clean up existing images for fresh start
    data_dir = "data/scraped_images"
    if os.path.exists(data_dir):
        print(f"Cleaning up existing images in {data_dir}...")
        shutil.rmtree(data_dir)
        print("✅ Existing images removed")
    
    # Initialize alternative web scraping service
    scraper = AlternativeWebScrapingService()
    
    try:
        # Use the short names dataset (100 products with short, searchable names)
        csv_file_path = "data/CNN_Model_Train_Data_short_names.csv"
        
        # Fallback options if short names dataset doesn't exist
        fallback_options = [
            "data/CNN_Model_Train_Data_very_short.csv",
            "data/CNN_Model_Train_Data_short.csv",
            "data/CNN_Model_Train_Data_best_searchable.csv",
            "data/CNN_Model_Train_Data_serpapi_optimized.csv",
            "data/CNN_Model_Train_Data_balanced_125.csv",
            "data/CNN_Model_Train_Data_quality_83.csv", 
            "data/CNN_Model_Train_Data_premium_50.csv",
            "data/CNN_Model_Train_Data_recommended.csv",
            "data/CNN_Model_Train_Data.csv"
        ]
        
        if not os.path.exists(csv_file_path):
            print(f"Short names dataset not found, checking alternatives...")
            for fallback in fallback_options:
                if os.path.exists(fallback):
                    csv_file_path = fallback
                    print(f"Using fallback: {csv_file_path}")
                    break
        
        if not os.path.exists(csv_file_path):
            print(f"Error: No dataset file found!")
            print("Please create a dataset first:")
            print("  python create_short_names_dataset.py")
            return
        
        print(f"Found dataset file: {csv_file_path}")
        
        # Count products in the dataset
        import pandas as pd
        df = pd.read_csv(csv_file_path)
        num_products = len(df)
        print(f"Dataset contains {num_products} products")
        
        # Check available APIs
        api_name, api_config = scraper.get_best_api()
        
        if not api_name:
            print("\n❌ No API available!")
            print("\nPlease set up one of these APIs:")
            print("\n1. Bing Image Search API (1000 free requests/month):")
            print("   - Go to: https://www.microsoft.com/en-us/bing/apis/bing-image-search-api")
            print("   - Create a free account and get API key")
            print("   - Set: export BING_SEARCH_KEY=your_key_here")
            
            print("\n2. Pixabay API (5000 free requests/hour):")
            print("   - Go to: https://pixabay.com/api/docs/")
            print("   - Create a free account and get API key")
            print("   - Set: export PIXABAY_API_KEY=your_key_here")
            
            print("\n3. Unsplash API (5000 free requests/hour):")
            print("   - Go to: https://unsplash.com/developers")
            print("   - Create a free account and get API key")
            print("   - Set: export UNSPLASH_API_KEY=your_key_here")
            
            print("\n4. Google Custom Search API (100 free requests/day):")
            print("   - Go to: https://developers.google.com/custom-search")
            print("   - Create API key and Custom Search Engine")
            print("   - Set: export GOOGLE_API_KEY=your_key_here")
            print("   - Set: export GOOGLE_CX=your_search_engine_id")
            
            return
        
        print(f"\n✅ Using {api_config['name']}")
        print(f"   Free requests: {api_config['free_requests']}")
        
        # Calculate optimal images per product
        if api_config['free_requests'] == float('inf'):
            # Unlimited API (DuckDuckGo)
            images_per_product = 5
            print(f"   Unlimited API - using {images_per_product} images per product")
        else:
            # Limited API
            images_per_product = min(5, api_config['free_requests'] // num_products)
            print(f"   Limited API - using {images_per_product} images per product")
        
        print(f"\n📊 Scraping Plan:")
        print(f"  Products: {num_products}")
        print(f"  Images per product: {images_per_product}")
        print(f"  Total images to download: {num_products * images_per_product}")
        print(f"  API requests needed: {num_products}")
        print(f"  API requests remaining: {api_config['free_requests'] - num_products}")
        
        if api_config['free_requests'] != float('inf') and num_products > api_config['free_requests']:
            print(f"\n⚠️  Warning: Dataset too large for free tier!")
            print(f"   Consider using a smaller dataset or upgrading API plan")
            return
        
        # Scrape images
        print(f"\nStarting alternative image scraping...")
        print(f"Target: {images_per_product} images per product")
        
        results = scraper.scrape_product_images(csv_file_path, images_per_product=images_per_product)
        
        if not results.empty:
            print(f"\n🎉 Alternative scraping completed successfully!")
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
                print("   - Using a different API with more requests")
                print("   - Using a smaller product set")
                print("   - Using heavy data augmentation")
                
        else:
            print("No images were downloaded. Check the scraping logs above.")
    
    except Exception as e:
        print(f"Error during alternative scraping: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Clean up resources
        scraper.cleanup()
        print("\nAlternative web scraping completed.")

if __name__ == "__main__":
    main()