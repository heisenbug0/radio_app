import logging
import os
import shutil

import pandas as pd

from services.web_scraping import WebScrapingService

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

def main():
    data_dir = "data/scraped_images"
    if os.path.exists(data_dir):
        logger.info("Removing existing images at %s", data_dir)
        shutil.rmtree(data_dir)
    os.makedirs(data_dir, exist_ok=True)

    csv_file = "data/CNN_Model_Train_Data.csv"
    if not os.path.exists(csv_file):
        logger.error("CSV not found: %s", csv_file)
        return

    df = pd.read_csv(csv_file, dtype=str)
    num_products = df["StockCode"].astype(str).nunique()
    max_api_requests = 5000
    images_per_product = max(1, max_api_requests // max(1, num_products))
    images_per_product = min(images_per_product, 6)

    logger.info("Starting scraping run: products=%d images_per_product=%d", num_products, images_per_product)
    service = WebScrapingService()
    results = service.scrape_product_images(csv_file, images_per_product=images_per_product)

    if results.empty:
        logger.warning("No images downloaded.")
        return

    product_counts = results["stock_code"].value_counts()
    logger.info("Downloaded images per product (sample):\n%s", product_counts.head(20).to_string())
    logger.info("Total images: %d", len(results))
    logger.info("Saved results to: %s", os.path.join(service.download_dir, "scraping_results.csv"))

if __name__ == "__main__":
    main()
