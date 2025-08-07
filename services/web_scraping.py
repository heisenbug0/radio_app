import os
import requests
import pandas as pd
import time
from serpapi import GoogleSearch
import urllib.parse
import random
import re # Added for _clean_product_name

class WebScrapingService:
    def __init__(self):
        self.api_key = os.getenv('SERPAPI_KEY')
        self.download_dir = "data/scraped_images"
        self.results = []
        
        # Create download directory if it doesn't exist
        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir)
    
    def scrape_product_images(self, csv_file_path, images_per_product=15):
        """Scrape product images using SerpAPI Google Image Search"""
        if not self.api_key:
            print("Error: SERPAPI_KEY not found in environment variables")
            print("Please set SERPAPI_KEY in your .env file")
            return pd.DataFrame()
        
        print(f"Starting image scraping for {images_per_product} images per product...")
        print("Note: This will use more API calls but will give better training results!")
        
        # Read product data with names
        df = pd.read_csv(csv_file_path)
        
        # If we only have stock codes, we need to get product names from the main dataset
        if 'StockCode' in df.columns and len(df.columns) == 1:
            print("Stock codes only found. Loading product names from main dataset...")
            try:
                # Load the main dataset to get product names
                main_df = pd.read_csv('data/dataset.csv', encoding='latin-1')
                # Get unique product names for each stock code
                product_names = main_df.groupby('StockCode')['Description'].first().reset_index()
                df = df.merge(product_names, on='StockCode', how='left')
                print(f"Loaded product names for {len(df)} products")
            except Exception as e:
                print(f"Error loading product names: {e}")
                print("Falling back to stock code search (less accurate)")
                return self._scrape_with_stock_codes(df, images_per_product)
        
        total_images = 0
        successful_products = 0
        
        for i, row in df.iterrows():
            stock_code = row['StockCode']
            product_name = row.get('Description', f'product {stock_code}')
            
            print(f"\nProcessing product {i+1}/{len(df)}: {stock_code}")
            print(f"Product: {product_name}")
            
            try:
                # Search for product images using the actual product name
                images = self._search_product_images_robust(product_name, stock_code, images_per_product)
                
                if images:
                    # Download images
                    downloaded_count = self._download_images_robust(stock_code, images)
                    total_images += downloaded_count
                    successful_products += 1
                    
                    print(f"  Downloaded {downloaded_count} images for {stock_code}")
                else:
                    print(f"  No images found for {stock_code}")
                    
            except Exception as e:
                print(f"  Error processing {stock_code}: {e}")
            
            # Rate limiting - be respectful to the API
            time.sleep(random.uniform(1, 2))
        
        print(f"\nScraping completed!")
        print(f"Successfully processed {successful_products}/{len(df)} products")
        print(f"Total images downloaded: {total_images}")
        print(f"Average images per product: {total_images/len(df):.1f}")
        
        # Save results
        results_df = pd.DataFrame(self.results)
        if not results_df.empty:
            results_path = os.path.join(self.download_dir, 'scraping_results.csv')
            results_df.to_csv(results_path, index=False)
            print(f"Results saved to: {results_path}")
        
        return results_df
    
    def _scrape_with_stock_codes(self, df, images_per_product):
        """Fallback method using stock codes (less accurate)"""
        print("⚠️  Using stock code search - results may not match products!")
        
        total_images = 0
        successful_products = 0
        
        for i, row in df.iterrows():
            stock_code = row['StockCode']
            print(f"\nProcessing product {i+1}/{len(df)}: {stock_code}")
            
            try:
                # Search for product images with multiple query variations
                images = self._search_product_images_robust_stock_code(stock_code, images_per_product)
                
                if images:
                    # Download images
                    downloaded_count = self._download_images_robust(stock_code, images)
                    total_images += downloaded_count
                    successful_products += 1
                    
                    print(f"  Downloaded {downloaded_count} images for {stock_code}")
                else:
                    print(f"  No images found for {stock_code}")
                    
            except Exception as e:
                print(f"  Error processing {stock_code}: {e}")
            
            # Rate limiting - be respectful to the API
            time.sleep(random.uniform(1, 2))
        
        print(f"\nScraping completed!")
        print(f"Successfully processed {successful_products}/{len(df)} products")
        print(f"Total images downloaded: {total_images}")
        print(f"Average images per product: {total_images/len(df):.1f}")
        
        # Save results
        results_df = pd.DataFrame(self.results)
        if not results_df.empty:
            results_path = os.path.join(self.download_dir, 'scraping_results.csv')
            results_df.to_csv(results_path, index=False)
            print(f"Results saved to: {results_path}")
        
        return results_df
    
    def _search_product_images_robust(self, product_name, stock_code, num_images):
        """Search for product images using actual product names for accuracy"""
        # Clean the product name for better search results
        clean_name = self._clean_product_name(product_name)
        
        # Try different search query variations for better coverage
        search_variations = [
            clean_name,
            f"{clean_name} product",
            f"{clean_name} item",
            f"{clean_name} image",
            f"{clean_name} photo",
            f"{clean_name} picture",
            f"{clean_name} retail",
            f"{clean_name} store",
            f"{clean_name} shopping",
            f"{clean_name} online"
        ]
        
        all_images = []
        
        for query in search_variations:
            try:
                # Get more images per query to have better selection
                images = self._search_product_images(query, min(num_images // 3, 10))
                all_images.extend(images)
                
                if len(all_images) >= num_images * 2:  # Get extra for filtering
                    break
                    
            except Exception as e:
                print(f"    Search failed for query '{query}': {e}")
                continue
        
        # Remove duplicates based on URL
        unique_images = []
        seen_urls = set()
        for img in all_images:
            if img['url'] not in seen_urls:
                unique_images.append(img)
                seen_urls.add(img['url'])
        
        # Filter out low-quality images (very small or very large)
        filtered_images = []
        for img in unique_images:
            url = img['url'].lower()
            # Skip very small images or thumbnails
            if any(skip in url for skip in ['thumb', 'icon', 'small', 'mini']):
                continue
            # Skip very large images that might be banners
            if any(skip in url for skip in ['banner', 'header', 'background']):
                continue
            filtered_images.append(img)
        
        print(f"    Found {len(unique_images)} unique images, filtered to {len(filtered_images)}")
        
        return filtered_images[:num_images]
    
    def _search_product_images_robust_stock_code(self, stock_code, num_images):
        """Fallback search using stock codes (less accurate)"""
        # Try different search query variations for better coverage
        search_variations = [
            f"product {stock_code}",
            f"item {stock_code}",
            f"part {stock_code}",
            f"component {stock_code}",
            f"electronic {stock_code}",
            f"hardware {stock_code}",
            f"device {stock_code}",
            f"equipment {stock_code}",
            f"tool {stock_code}",
            f"accessory {stock_code}",
            f"supply {stock_code}",
            f"material {stock_code}"
        ]
        
        all_images = []
        
        for query in search_variations:
            try:
                # Get more images per query to have better selection
                images = self._search_product_images(query, min(num_images // 3, 10))
                all_images.extend(images)
                
                if len(all_images) >= num_images * 2:  # Get extra for filtering
                    break
                    
            except Exception as e:
                print(f"    Search failed for query '{query}': {e}")
                continue
        
        # Remove duplicates based on URL
        unique_images = []
        seen_urls = set()
        for img in all_images:
            if img['url'] not in seen_urls:
                unique_images.append(img)
                seen_urls.add(img['url'])
        
        # Filter out low-quality images (very small or very large)
        filtered_images = []
        for img in unique_images:
            url = img['url'].lower()
            # Skip very small images or thumbnails
            if any(skip in url for skip in ['thumb', 'icon', 'small', 'mini']):
                continue
            # Skip very large images that might be banners
            if any(skip in url for skip in ['banner', 'header', 'background']):
                continue
            filtered_images.append(img)
        
        print(f"    Found {len(unique_images)} unique images, filtered to {len(filtered_images)}")
        
        return filtered_images[:num_images]
    
    def _search_product_images(self, search_query, num_images):
        """Search for product images using SerpAPI"""
        try:
            # Configure search parameters
            search_params = {
                "q": search_query,
                "tbm": "isch",  # Image search
                "api_key": self.api_key,
                "num": num_images,
                "safe": "active",
                "img_type": "photo",
                "img_size": "medium",
                "gl": "us",  # Search in US
                "hl": "en"   # English results
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
            print(f"    Search error for '{search_query}': {e}")
            return []
    
    def _download_images_robust(self, stock_code, images):
        """Download images with retry logic and better error handling"""
        downloaded_count = 0
        
        for i, image_info in enumerate(images):
            try:
                url = image_info['url']
                
                # Skip certain problematic domains
                if any(domain in url.lower() for domain in ['autozone.com', 'oreillyauto.com']):
                    print(f"    Skipping problematic domain: {url}")
                    continue
                
                # Download image with retry logic
                success = self._download_single_image(stock_code, i+1, image_info)
                if success:
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
    
    def _download_single_image(self, stock_code, image_num, image_info):
        """Download a single image with retry logic"""
        url = image_info['url']
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                # Use different user agents to avoid blocking
                user_agents = [
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                ]
                
                headers = {
                    'User-Agent': random.choice(user_agents),
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                }
                
                # Download image
                response = requests.get(url, headers=headers, timeout=15, stream=True)
                response.raise_for_status()
                
                # Check if it's actually an image
                content_type = response.headers.get('content-type', '')
                if not content_type.startswith('image/'):
                    print(f"    Skipping non-image content: {content_type}")
                    return False
                
                # Determine file extension
                if 'jpeg' in content_type or 'jpg' in content_type:
                    ext = '.jpg'
                elif 'png' in content_type:
                    ext = '.png'
                elif 'webp' in content_type:
                    ext = '.webp'
                else:
                    ext = '.jpg'  # Default
                
                # Save image
                filename = f"{stock_code}_{image_num}{ext}"
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
                
                return True
                
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 403:
                    print(f"    Access forbidden (403) for {url}, attempt {attempt + 1}/{max_retries}")
                    if attempt < max_retries - 1:
                        time.sleep(random.uniform(1, 3))
                        continue
                else:
                    print(f"    HTTP error {e.response.status_code} for {url}")
                return False
                
            except Exception as e:
                print(f"    Download error (attempt {attempt + 1}/{max_retries}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(random.uniform(1, 2))
                    continue
                return False
        
        return False
    
    def _clean_product_name(self, product_name):
        """Clean product name for better search results"""
        if not product_name or pd.isna(product_name):
            return ""
        
        # Remove special characters and extra spaces
        clean_name = str(product_name).strip()
        clean_name = re.sub(r'[^\w\s-]', ' ', clean_name)  # Keep only alphanumeric, spaces, and hyphens
        clean_name = re.sub(r'\s+', ' ', clean_name)  # Replace multiple spaces with single space
        
        # Remove common prefixes/suffixes that don't help search
        remove_words = ['the', 'a', 'an', 'new', 'brand', 'original', 'genuine', 'authentic']
        words = clean_name.lower().split()
        words = [word for word in words if word not in remove_words and len(word) > 1]
        
        clean_name = ' '.join(words)
        
        # Limit length to avoid overly long queries
        if len(clean_name) > 50:
            clean_name = ' '.join(clean_name.split()[:8])
        
        return clean_name.strip()
    
    def cleanup(self):
        """Clean up resources"""
        pass  # No cleanup needed for SerpAPI