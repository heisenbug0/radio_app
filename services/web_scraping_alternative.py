#!/usr/bin/env python3
"""
Alternative Web Scraping Service
Uses different APIs with more generous free tiers
"""

import os
import time
import random
import requests
import pandas as pd
from urllib.parse import urlparse
import json

class AlternativeWebScrapingService:
    def __init__(self):
        self.download_dir = "data/scraped_images"
        self.results = []
        
        # Create download directory
        os.makedirs(self.download_dir, exist_ok=True)
        
        # Initialize different API options
        self.api_options = self._initialize_apis()
        
    def _initialize_apis(self):
        """Initialize different API options with their free limits"""
        apis = {}
        
        # Option 1: Bing Image Search API (1000 free requests/month)
        bing_key = os.getenv('BING_SEARCH_KEY')
        if bing_key:
            apis['bing'] = {
                'name': 'Bing Image Search',
                'key': bing_key,
                'free_requests': 1000,
                'endpoint': 'https://api.bing.microsoft.com/v7.0/images/search'
            }
        
        # Option 2: DuckDuckGo (no API key needed, unlimited)
        apis['duckduckgo'] = {
            'name': 'DuckDuckGo',
            'key': None,
            'free_requests': float('inf'),
            'endpoint': 'https://duckduckgo.com/'
        }
        
        # Option 3: Google Custom Search API (100 free requests/day)
        google_key = os.getenv('GOOGLE_API_KEY')
        google_cx = os.getenv('GOOGLE_CX')
        if google_key and google_cx:
            apis['google'] = {
                'name': 'Google Custom Search',
                'key': google_key,
                'cx': google_cx,
                'free_requests': 100,
                'endpoint': 'https://www.googleapis.com/customsearch/v1'
            }
        
        # Option 4: Pixabay API (5000 free requests/hour)
        pixabay_key = os.getenv('PIXABAY_API_KEY')
        if pixabay_key:
            apis['pixabay'] = {
                'name': 'Pixabay',
                'key': pixabay_key,
                'free_requests': 5000,
                'endpoint': 'https://pixabay.com/api/'
            }
        
        # Option 5: Unsplash API (5000 free requests/hour)
        unsplash_key = os.getenv('UNSPLASH_API_KEY')
        if unsplash_key:
            apis['unsplash'] = {
                'name': 'Unsplash',
                'key': unsplash_key,
                'free_requests': 5000,
                'endpoint': 'https://api.unsplash.com/search/photos'
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
                self.api_options['bing']['endpoint'],
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
    
    def search_images_duckduckgo(self, query, count=10):
        """Search images using DuckDuckGo (no API key needed)"""
        try:
            # DuckDuckGo Instant Answer API
            url = "https://api.duckduckgo.com/"
            params = {
                'q': f"{query} images",
                'format': 'json',
                'no_html': '1',
                'skip_disambig': '1'
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                images = []
                
                # DuckDuckGo doesn't always return images, so we'll use a fallback
                # For now, return empty list and suggest using a different API
                print(f"    DuckDuckGo doesn't provide direct image URLs")
                return []
            else:
                print(f"    DuckDuckGo API error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"    DuckDuckGo search error: {e}")
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
                self.api_options['google']['endpoint'],
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
    
    def search_images_pixabay(self, query, count=10):
        """Search images using Pixabay API"""
        try:
            params = {
                'key': self.api_options['pixabay']['key'],
                'q': query,
                'image_type': 'photo',
                'per_page': min(count, 200),  # Pixabay limit
                'safesearch': 'true'
            }
            
            response = requests.get(
                self.api_options['pixabay']['endpoint'],
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
        """Search images using Unsplash API"""
        try:
            headers = {
                'Authorization': f'Client-ID {self.api_options["unsplash"]["key"]}'
            }
            
            params = {
                'query': query,
                'per_page': min(count, 30),  # Unsplash limit
                'orientation': 'landscape'
            }
            
            response = requests.get(
                self.api_options['unsplash']['endpoint'],
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
    
    def search_images(self, query, count=10):
        """Search images using the best available API"""
        api_name, api_config = self.get_best_api()
        
        if not api_name:
            print("    No API available")
            return []
        
        print(f"    Using {api_config['name']} (free requests: {api_config['free_requests']})")
        
        if api_name == 'bing':
            return self.search_images_bing(query, count)
        elif api_name == 'duckduckgo':
            return self.search_images_duckduckgo(query, count)
        elif api_name == 'google':
            return self.search_images_google(query, count)
        elif api_name == 'pixabay':
            return self.search_images_pixabay(query, count)
        elif api_name == 'unsplash':
            return self.search_images_unsplash(query, count)
        else:
            print(f"    Unknown API: {api_name}")
            return []
    
    def download_image(self, url, filepath):
        """Download an image from URL"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10, stream=True)
            
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                return True
            else:
                return False
                
        except Exception as e:
            print(f"      Download error: {e}")
            return False
    
    def scrape_product_images(self, csv_file_path, images_per_product=2):
        """Scrape product images using alternative APIs"""
        api_name, api_config = self.get_best_api()
        
        if not api_name:
            print("Error: No API available")
            print("Please set up one of these APIs:")
            print("  - BING_SEARCH_KEY (1000 free requests/month)")
            print("  - GOOGLE_API_KEY + GOOGLE_CX (100 free requests/day)")
            print("  - PIXABAY_API_KEY (5000 free requests/hour)")
            print("  - UNSPLASH_API_KEY (5000 free requests/hour)")
            return pd.DataFrame()
        
        print(f"Using {api_config['name']} with {api_config['free_requests']} free requests")
        
        # Read product data
        df = pd.read_csv(csv_file_path)
        
        # Load product names from main dataset
        main_df = pd.read_csv('data/dataset.csv', encoding='latin-1')
        main_df['StockCode'] = main_df['StockCode'].astype(str)
        df['StockCode'] = df['StockCode'].astype(str)
        
        product_names = main_df.groupby('StockCode')['Description'].first().reset_index()
        df = df.merge(product_names, on='StockCode', how='left')
        
        total_images = 0
        successful_products = 0
        
        for i, row in df.iterrows():
            stock_code = row['StockCode']
            product_name = row.get('Description', '')
            
            if not product_name or pd.isna(product_name):
                continue
            
            print(f"\nProcessing product {i+1}/{len(df)}: {stock_code}")
            print(f"Product: {product_name}")
            
            try:
                # Search for images
                images = self.search_images(product_name, images_per_product)
                
                if images:
                    # Download images
                    downloaded_count = 0
                    for j, img in enumerate(images[:images_per_product]):
                        filename = f"{stock_code}_{j+1}.jpg"
                        filepath = os.path.join(self.download_dir, filename)
                        
                        if self.download_image(img['url'], filepath):
                            downloaded_count += 1
                            self.results.append({
                                'stock_code': stock_code,
                                'product_name': product_name,
                                'image_url': img['url'],
                                'local_path': filepath
                            })
                    
                    total_images += downloaded_count
                    successful_products += 1
                    print(f"  Downloaded {downloaded_count} images for {stock_code}")
                else:
                    print(f"  No images found for {stock_code}")
                    
            except Exception as e:
                print(f"  Error processing {stock_code}: {e}")
            
            # Rate limiting
            time.sleep(random.uniform(1, 2))
        
        print(f"\nScraping completed!")
        print(f"Successfully processed {successful_products}/{len(df)} products")
        print(f"Total images downloaded: {total_images}")
        
        return pd.DataFrame(self.results)
    
    def cleanup(self):
        """Clean up resources"""
        pass