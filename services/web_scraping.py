import os
import requests
import pandas as pd
import time
from serpapi import GoogleSearch
import urllib.parse

class WebScrapingService:
    def __init__(self):
        self.api_key = os.getenv('SERPAPI_KEY')
        self.download_dir = "data/scraped_images"
        self.results = []
        
        # Create download directory if it doesn't exist
        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir)
    
    def scrape_product_images(self, csv_file_path, images_per_product=5):
        """Scrape product images using SerpAPI Google Image Search"""
        if not self.api_key:
            print("Error: SERPAPI_KEY not found in environment variables")
            print("Please set SERPAPI_KEY in your .env file")
            return pd.DataFrame()
        
        print(f"Starting image scraping for {images_per_product} images per product...")
        
        # Read product stock codes
        df = pd.read_csv(csv_file_path)
        stock_codes = df['StockCode'].tolist()
        
        total_images = 0
        successful_products = 0
        
        for i, stock_code in enumerate(stock_codes, 1):
            print(f"\nProcessing product {i}/{len(stock_codes)}: {stock_code}")
            
            try:
                # Search for product images
                images = self._search_product_images(stock_code, images_per_product)
                
                if images:
                    # Download images
                    downloaded_count = self._download_images(stock_code, images)
                    total_images += downloaded_count
                    successful_products += 1
                    
                    print(f"  Downloaded {downloaded_count} images for {stock_code}")
                else:
                    print(f"  No images found for {stock_code}")
                    
            except Exception as e:
                print(f"  Error processing {stock_code}: {e}")
            
            # Rate limiting - be respectful to the API
            time.sleep(1)
        
        print(f"\nScraping completed!")
        print(f"Successfully processed {successful_products}/{len(stock_codes)} products")
        print(f"Total images downloaded: {total_images}")
        
        # Save results
        results_df = pd.DataFrame(self.results)
        if not results_df.empty:
            results_path = os.path.join(self.download_dir, 'scraping_results.csv')
            results_df.to_csv(results_path, index=False)
            print(f"Results saved to: {results_path}")
        
        return results_df
    
    def _search_product_images(self, stock_code, num_images):
        """Search for product images using SerpAPI"""
        try:
            # Create search query
            search_query = f"product {stock_code}"
            
            # Configure search parameters
            search_params = {
                "q": search_query,
                "tbm": "isch",  # Image search
                "api_key": self.api_key,
                "num": num_images,
                "safe": "active",
                "img_type": "photo",
                "img_size": "medium"
            }
            
            # Perform search
            search = GoogleSearch(search_params)
            results = search.get_dict()
            
            # Extract image URLs
            images = []
            if "images_results" in results:
                for result in results["images_results"][:num_images]:
                    if "original" in result:
                        images.append({
                            'url': result['original'],
                            'title': result.get('title', ''),
                            'source': result.get('source', '')
                        })
            
            return images
            
        except Exception as e:
            print(f"    Search error for {stock_code}: {e}")
            return []
    
    def _download_images(self, stock_code, images):
        """Download images for a product"""
        downloaded_count = 0
        
        for i, image_info in enumerate(images):
            try:
                url = image_info['url']
                
                # Download image
                response = requests.get(url, timeout=10, stream=True)
                response.raise_for_status()
                
                # Determine file extension
                content_type = response.headers.get('content-type', '')
                if 'jpeg' in content_type or 'jpg' in content_type:
                    ext = '.jpg'
                elif 'png' in content_type:
                    ext = '.png'
                else:
                    ext = '.jpg'  # Default
                
                # Save image
                filename = f"{stock_code}_{i+1}{ext}"
                filepath = os.path.join(self.download_dir, filename)
                
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                
                # Record result
                self.results.append({
                    'stock_code': stock_code,
                    'filename': filename,
                    'url': url,
                    'title': image_info.get('title', ''),
                    'source': image_info.get('source', ''),
                    'status': 'success'
                })
                
                downloaded_count += 1
                
            except Exception as e:
                print(f"    Download error for image {i+1}: {e}")
                self.results.append({
                    'stock_code': stock_code,
                    'filename': f"{stock_code}_{i+1}_failed",
                    'url': image_info.get('url', ''),
                    'title': image_info.get('title', ''),
                    'source': image_info.get('source', ''),
                    'status': 'failed'
                })
        
        return downloaded_count
    
    def cleanup(self):
        """Clean up resources"""
        pass  # No cleanup needed for SerpAPI