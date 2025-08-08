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
        # Initialize different API options
        self.api_options = self._initialize_apis()
        self.api_key = os.getenv('SERPAPI_KEY')  # Keep for backward compatibility
        self.download_dir = "data/scraped_images"
        self.results = []
        self._product_seen = set()
        
        # Create download directory if it doesn't exist
        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir)
    
    def _initialize_apis(self):
        """Initialize different API options with their free limits"""
        apis = {}
        
        # Option 1: SerpAPI (original)
        serpapi_key = os.getenv('SERPAPI_KEY')
        if serpapi_key:
            apis['serpapi'] = {
                'name': 'SerpAPI',
                'key': serpapi_key,
                'free_requests': 250,
                'priority': 1
            }
        
        # Option 2: Pixabay API (5000 free requests/hour)
        pixabay_key = os.getenv('PIXABAY_API_KEY')
        if pixabay_key:
            apis['pixabay'] = {
                'name': 'Pixabay',
                'key': pixabay_key,
                'free_requests': 5000,
                'priority': 2
            }
        
        # Option 3: Unsplash API (5000 free requests/hour)
        unsplash_key = os.getenv('UNSPLASH_API_KEY')
        if unsplash_key:
            apis['unsplash'] = {
                'name': 'Unsplash',
                'key': unsplash_key,
                'free_requests': 5000,
                'priority': 3
            }
        
        # Option 4: Bing Image Search API (1000 free requests/month)
        bing_key = os.getenv('BING_SEARCH_KEY')
        if bing_key:
            apis['bing'] = {
                'name': 'Bing Image Search',
                'key': bing_key,
                'free_requests': 1000,
                'priority': 4
            }
        
        # Option 5: Google Custom Search API (100 free requests/day)
        google_key = os.getenv('GOOGLE_API_KEY')
        google_cx = os.getenv('GOOGLE_CX')
        if google_key and google_cx:
            apis['google'] = {
                'name': 'Google Custom Search',
                'key': google_key,
                'cx': google_cx,
                'free_requests': 100,
                'priority': 5
            }
        
        return apis
    
    def get_best_api(self):
        """Get the best available API based on free requests"""
        if not self.api_options:
            return None
        
        # Sort by free requests (highest first)
        sorted_apis = sorted(self.api_options.items(), 
                           key=lambda x: x[1]['free_requests'], reverse=True)
        
        return sorted_apis[0][0], sorted_apis[0][1]
    
    def search_images_pixabay(self, query, count=10):
        """Search images using Pixabay API (official docs: https://pixabay.com/api/docs/)"""
        try:
            params = {
                'key': self.api_options['pixabay']['key'],  # API key as query param
                'q': query,
                'image_type': 'photo',
                'per_page': min(count, 200),  # Pixabay limit
                'safesearch': 'true'
            }
            response = requests.get(
                'https://pixabay.com/api/',
                params=params,
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                images = []
                for item in data.get('hits', []):
                    images.append({
                        'url': item.get('webformatURL', ''),
                        'title': item.get('tags', ''),
                        'width': item.get('webformatWidth', 0),
                        'height': item.get('webformatHeight', 0)
                    })
                return images
            else:
                print(f"    Pixabay API error: {response.status_code}")
                return []
        except Exception as e:
            print(f"    Pixabay search error: {e}")
            return []

    def search_images_unsplash(self, query, count=10):
        """Search images using Unsplash API (official docs: https://unsplash.com/documentation#search-photos)"""
        try:
            # Unsplash uses an Access Key (not OAuth) as 'Authorization: Client-ID <ACCESS_KEY>'
            headers = {
                'Authorization': f'Client-ID {self.api_options["unsplash"]["key"]}'
            }
            params = {
                'query': query,
                'per_page': min(count, 30),  # Unsplash limit
                'orientation': 'landscape'
            }
            response = requests.get(
                'https://api.unsplash.com/search/photos',
                headers=headers,
                params=params,
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                images = []
                for item in data.get('results', []):
                    images.append({
                        'url': item.get('urls', {}).get('regular', ''),
                        'title': item.get('description', ''),
                        'width': item.get('width', 0),
                        'height': item.get('height', 0)
                    })
                return images
            else:
                print(f"    Unsplash API error: {response.status_code}")
                return []
        except Exception as e:
            print(f"    Unsplash search error: {e}")
            return []
    
    def search_images_bing(self, query, count=10):
        """Search images using Bing Image Search API"""
        try:
            headers = {
                'Ocp-Apim-Subscription-Key': self.api_options['bing']['key']
            }
            
            params = {
                'q': query,
                'count': min(count, 150),  # Bing limit
                'imageType': 'photo',
                'safeSearch': 'strict'
            }
            
            response = requests.get(
                'https://api.bing.microsoft.com/v7.0/images/search',
                headers=headers,
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                images = []
                
                for item in data.get('value', []):
                    images.append({
                        'url': item.get('contentUrl', ''),
                        'title': item.get('name', ''),
                        'width': item.get('width', 0),
                        'height': item.get('height', 0)
                    })
                
                return images
            else:
                print(f"    Bing API error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"    Bing search error: {e}")
            return []
    
    def search_images_google(self, query, count=10):
        """Search images using Google Custom Search API"""
        try:
            params = {
                'key': self.api_options['google']['key'],
                'cx': self.api_options['google']['cx'],
                'q': query,
                'searchType': 'image',
                'num': min(count, 10),  # Google limit
                'safe': 'active'
            }
            
            response = requests.get(
                'https://www.googleapis.com/customsearch/v1',
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                images = []
                
                for item in data.get('items', []):
                    images.append({
                        'url': item.get('link', ''),
                        'title': item.get('title', ''),
                        'width': item.get('image', {}).get('width', 0),
                        'height': item.get('image', {}).get('height', 0)
                    })
                
                return images
            else:
                print(f"    Google API error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"    Google search error: {e}")
            return []
    
    def _search_images(self, query, count=10):
        """Search images using the best available API"""
        api_name, api_config = self.get_best_api()
        
        if not api_name:
            print("    No API available")
            return []
        
        print(f"    Using {api_config['name']} (free requests: {api_config['free_requests']})")
        
        if api_name == 'serpapi':
            return self._search_product_images_serpapi(query, count)
        elif api_name == 'pixabay':
            return self.search_images_pixabay(query, count)
        elif api_name == 'unsplash':
            return self.search_images_unsplash(query, count)
        elif api_name == 'bing':
            return self.search_images_bing(query, count)
        elif api_name == 'google':
            return self.search_images_google(query, count)
        else:
            print(f"    Unknown API: {api_name}")
            return []
    
    def _search_product_images_serpapi(self, search_query, num_images):
        """Search for product images using SerpAPI (original method)"""
        try:
            search = GoogleSearch({
                "q": search_query,
                "tbm": "isch",
                "api_key": self.api_key,
                "num": num_images,
                "safe": "active",
                "img_type": "photo",
                "img_size": "medium",
                "gl": "us",
                "hl": "en"
            })
            
            results = search.get_dict()
            images = []
            
            if "images_results" in results:
                for img in results["images_results"]:
                    if "original" in img:
                        images.append({
                            'url': img["original"],
                            'title': img.get("title", ""),
                            'width': img.get("width", 0),
                            'height': img.get("height", 0)
                        })
            
            return images
            
        except Exception as e:
            print(f"    SerpAPI search error: {e}")
            return []
    
    def scrape_product_images(self, csv_file_path, images_per_product=15):
        """Scrape product images using the best available API"""
        best_api = self.get_best_api()
        
        if not best_api:
            print("Error: No API available")
            print("Please set up one of these APIs:")
            print("  - SERPAPI_KEY (250 free requests)")
            print("  - PIXABAY_API_KEY (5000 free requests/hour)")
            print("  - UNSPLASH_API_KEY (5000 free requests/hour)")
            print("  - BING_SEARCH_KEY (1000 free requests/month)")
            print("  - GOOGLE_API_KEY + GOOGLE_CX (100 free requests/day)")
            return pd.DataFrame()
        
        api_name, api_config = best_api
        print(f"Using {api_config['name']} with {api_config['free_requests']} free requests")
        
        print(f"Starting image scraping for {images_per_product} images per product...")
        print("Note: This will use more API calls but will give better training results!")
        
        # Read product data and ensure uniqueness
        df = pd.read_csv(csv_file_path)
        # Keep unique StockCodes only
        if 'StockCode' in df.columns:
            df['StockCode'] = df['StockCode'].astype(str)
            df = df.drop_duplicates(subset=['StockCode'])
        
        # If we only have stock codes, we need to get product names from the main dataset
        if 'StockCode' in df.columns and len(df.columns) == 1:
            print("Stock codes only found. Loading product names from main dataset...")
            try:
                # Load the main dataset to get product names
                main_df = pd.read_csv('data/dataset.csv', encoding='latin-1')
                
                # Clean stock codes in both dataframes
                def clean_stock_code(code):
                    """Clean stock code by removing special characters"""
                    if pd.isna(code):
                        return None
                    # Convert to string and remove special characters
                    code_str = str(code)
                    # Remove special characters like ö, ^, etc.
                    import re
                    cleaned = re.sub(r'[^0-9]', '', code_str)
                    return cleaned if cleaned else None
                
                # Clean stock codes in both dataframes
                df['StockCode'] = df['StockCode'].apply(clean_stock_code)
                main_df['StockCode'] = main_df['StockCode'].apply(clean_stock_code)
                
                # Remove rows with None stock codes
                df = df.dropna(subset=['StockCode'])
                main_df = main_df.dropna(subset=['StockCode'])
                
                # Convert to string for merging
                df['StockCode'] = df['StockCode'].astype(str)
                main_df['StockCode'] = main_df['StockCode'].astype(str)
                
                # Get unique product names for each stock code
                product_names = main_df.groupby('StockCode')['Description'].first().reset_index()
                df = df.merge(product_names, on='StockCode', how='left')
                print(f"Loaded product names for {len(df)} products")
                
                # Check if we have product names
                missing_names = df[df['Description'].isna()]
                if len(missing_names) > 0:
                    print(f"Warning: {len(missing_names)} products without descriptions:")
                    for _, row in missing_names.iterrows():
                        print(f"  Stock code {row['StockCode']} - No description found")
                    print("These products will be skipped.")
                    df = df.dropna(subset=['Description'])
                
            except Exception as e:
                print(f"Error loading product names: {e}")
                print("❌ Cannot proceed without product names!")
                print("Please ensure the main dataset contains product descriptions.")
                return pd.DataFrame()
        
        # Verify we have product names
        if 'Description' not in df.columns:
            print("❌ No product descriptions found!")
            print("Cannot proceed with stock code search as it will give wrong results.")
            return pd.DataFrame()
        
        total_images = 0
        successful_products = 0
        
        for i, row in df.iterrows():
            stock_code = row['StockCode']
            product_name = row.get('Description', '')
            
            if not product_name or pd.isna(product_name):
                print(f"Skipping {stock_code} - no product description available")
                continue
            
            if stock_code in self._product_seen:
                continue
            self._product_seen.add(stock_code)

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
    
    def _clean_product_name(self, product_name):
        """Clean and optimize product name for better search results"""
        if not product_name or pd.isna(product_name):
            return None
        
        # Convert to string and clean
        name = str(product_name).strip()
        
        # Remove common prefixes that don't help search
        prefixes_to_remove = [
            'SET OF ', 'SET ', 'PACK OF ', 'PACK ', 'BOX OF ', 'BOX ',
            'LARGE ', 'SMALL ', 'MEDIUM ', 'MINI ', 'BIG ',
            '$', '£', '€', '¥'
        ]
        
        for prefix in prefixes_to_remove:
            if name.upper().startswith(prefix):
                name = name[len(prefix):].strip()
        
        # Remove special characters and extra spaces
        import re
        name = re.sub(r'[^\w\s]', ' ', name)
        name = re.sub(r'\s+', ' ', name).strip()
        
        # Normalize domain-specific synonyms to broaden search
        synonym_map = {
            'lantern': ['lantern', 'candle lamp'],
            'bottle': ['bottle', 'flask'],
            'heart': ['heart', 'love shape'],
            'bag': ['bag', 'tote'],
            'mug': ['mug', 'cup']
        }

        # Extract key words (avoid generic terms)
        words = name.split()
        key_words = []
        
        # Common words to avoid (too generic)
        generic_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
            'before', 'after', 'above', 'below', 'between', 'among', 'within',
            'set', 'pack', 'box', 'large', 'small', 'medium', 'mini', 'big',
            'design', 'style', 'color', 'colour', 'size', 'type', 'kind', 'sort'
        }
        
        for word in words:
            word_lower = word.lower()
            if (word_lower not in generic_words and 
                len(word) > 2 and 
                not word.isdigit()):
                key_words.append(word)
        
        # If we have key words, use them; otherwise use original (cleaned)
        if key_words:
            # Expand with a synonym when available to improve recall
            expanded = []
            for kw in key_words[:3]:
                expanded.append(kw)
                for base, syns in synonym_map.items():
                    if kw.lower() == base:
                        expanded.append(syns[0])
                        break
            optimized_name = ' '.join(dict.fromkeys(expanded))
        else:
            # Fallback: use first few words of cleaned name
            words = name.split()
            optimized_name = ' '.join(words[:3])  # Limit to 3 words
        
        # Ensure we have something meaningful
        if len(optimized_name) < 3:
            optimized_name = name[:50]  # Use first 50 chars of original
        
        return optimized_name

    def _search_product_images_robust(self, product_name, stock_code, max_images=15):
        """Search for product images with multiple query variations"""
        if not self.api_key:
            print("Error: SERPAPI_KEY not found")
            return []
        
        # Clean and optimize the product name for search
        optimized_name = self._clean_product_name(product_name)
        print(f"    Optimized search term: '{optimized_name}'")
        
        # Create multiple search variations for better results
        brand_terms = ["retail", "store", "online", "shopping", "buy"]
        image_terms = ["image", "photo"]
        object_terms = ["product", "item"]
        search_variations = [optimized_name]
        for term in (object_terms + image_terms + brand_terms):
            search_variations.append(f"{optimized_name} {term}")
        
        # Limit variations based on max_images to avoid wasting API calls
        if max_images <= 5:
            search_variations = search_variations[:3]  # Use fewer variations for small requests
        elif max_images <= 10:
            search_variations = search_variations[:5]  # Use medium variations
        
        all_images = []
        
        for i, search_query in enumerate(search_variations):
            try:
                print(f"    Trying search variation {i+1}/{len(search_variations)}: '{search_query}'")
                
                # Calculate how many images to request for this variation
                images_per_variation = max(1, max_images // len(search_variations))
                
                # Search for images
                search_results = self._search_images(search_query, images_per_variation)
                
                if search_results:
                    all_images.extend(search_results)
                    print(f"      Found {len(search_results)} images")
                    
                    # If we have enough images, stop searching
                    if len(all_images) >= max_images:
                        break
                else:
                    print(f"      No images found")
                
                # Rate limiting between searches
                time.sleep(random.uniform(0.5, 1.0))
                
            except Exception as e:
                print(f"    Search error for '{search_query}': {e}")
                continue
        
        # Remove duplicates and limit to max_images
        unique_images = []
        seen_urls = set()
        
        for img in all_images:
            if img['url'] not in seen_urls:
                unique_images.append(img)
                seen_urls.add(img['url'])
                
                if len(unique_images) >= max_images:
                    break
        
        print(f"    Found {len(unique_images)} unique images, filtered to {len(unique_images)}")
        return unique_images
    
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
    
    def cleanup(self):
        """Clean up resources"""
        pass  # No cleanup needed for SerpAPI