import requests
from bs4 import BeautifulSoup
import os
import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import urllib.parse
import re

class WebScrapingService:
    def __init__(self):
        self.download_dir = "data/scraped_images"
        self.setup_directories()
        self.setup_driver()
    
    def setup_directories(self):
        """Create necessary directories for storing scraped images"""
        os.makedirs(self.download_dir, exist_ok=True)
        for subdir in ['train', 'test']:
            os.makedirs(os.path.join(self.download_dir, subdir), exist_ok=True)
    
    def setup_driver(self):
        """Setup Chrome WebDriver for web scraping"""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            
            self.driver = webdriver.Chrome(
                ChromeDriverManager().install(),
                options=chrome_options
            )
        except Exception as e:
            print(f"Warning: Chrome WebDriver setup failed: {e}")
            self.driver = None
    
    def search_products_on_amazon(self, product_name, max_images=10):
        """Search for product images on Amazon"""
        if not self.driver:
            print("WebDriver not available. Skipping Amazon search.")
            return []
        
        try:
            # Search URL for Amazon
            search_query = urllib.parse.quote(product_name)
            search_url = f"https://www.amazon.com/s?k={search_query}"
            
            self.driver.get(search_url)
            time.sleep(3)
            
            # Wait for images to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "img[data-image-latency]"))
            )
            
            # Find product images
            images = self.driver.find_elements(By.CSS_SELECTOR, "img[data-image-latency]")
            
            image_urls = []
            for img in images[:max_images]:
                src = img.get_attribute('src')
                if src and 'data:image' not in src:
                    image_urls.append(src)
            
            return image_urls
            
        except Exception as e:
            print(f"Error searching Amazon for {product_name}: {e}")
            return []
    
    def search_products_on_google(self, product_name, max_images=10):
        """Search for product images on Google Images"""
        if not self.driver:
            print("WebDriver not available. Skipping Google search.")
            return []
        
        try:
            # Search URL for Google Images
            search_query = urllib.parse.quote(product_name + " product")
            search_url = f"https://www.google.com/search?q={search_query}&tbm=isch"
            
            self.driver.get(search_url)
            time.sleep(3)
            
            # Find image elements
            images = self.driver.find_elements(By.CSS_SELECTOR, "img.rg_i")
            
            image_urls = []
            for img in images[:max_images]:
                src = img.get_attribute('src')
                if src and 'data:image' not in src:
                    image_urls.append(src)
            
            return image_urls
            
        except Exception as e:
            print(f"Error searching Google for {product_name}: {e}")
            return []
    
    def download_image(self, url, filename):
        """Download image from URL"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            filepath = os.path.join(self.download_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            return True
            
        except Exception as e:
            print(f"Error downloading image {url}: {e}")
            return False
    
    def scrape_product_images(self, csv_file_path, images_per_product=5):
        """Scrape images for products listed in the CSV file"""
        try:
            # Read the CSV file
            df = pd.read_csv(csv_file_path)
            
            print(f"Starting to scrape images for {len(df)} products...")
            
            scraped_data = []
            
            for idx, row in df.iterrows():
                stock_code = row['StockCode']
                product_name = str(stock_code).strip()
                
                print(f"Scraping images for product {idx+1}/{len(df)}: {product_name}")
                
                # Search on multiple platforms
                image_urls = []
                
                # Try Amazon first
                amazon_urls = self.search_products_on_amazon(product_name, images_per_product)
                image_urls.extend(amazon_urls)
                
                # If not enough images, try Google
                if len(image_urls) < images_per_product:
                    google_urls = self.search_products_on_google(product_name, images_per_product - len(image_urls))
                    image_urls.extend(google_urls)
                
                # Download images
                downloaded_count = 0
                for i, url in enumerate(image_urls):
                    if downloaded_count >= images_per_product:
                        break
                    
                    filename = f"{stock_code}_{i+1}.jpg"
                    if self.download_image(url, filename):
                        downloaded_count += 1
                        scraped_data.append({
                            'stock_code': stock_code,
                            'image_filename': filename,
                            'image_url': url
                        })
                
                # Add delay to be respectful to servers
                time.sleep(2)
            
            # Save scraping results
            results_df = pd.DataFrame(scraped_data)
            results_df.to_csv(os.path.join(self.download_dir, 'scraping_results.csv'), index=False)
            
            print(f"Scraping completed. Downloaded {len(scraped_data)} images.")
            return results_df
            
        except Exception as e:
            print(f"Error during scraping: {e}")
            return pd.DataFrame()
    
    def cleanup(self):
        """Clean up resources"""
        if self.driver:
            self.driver.quit()