#!/usr/bin/env python3
"""
training script for the cnn model (from scratch).
"""

import os
import argparse
import traceback
import pandas as pd

# use the simple from-scratch cnn service for module 3 compliance
from services.simple_cnn_model import CNNModelService


def parse_args():
    p = argparse.ArgumentParser(description="train product cnn (from scratch)")
    p.add_argument("--data-dir", default="data/scraped_images", help="directory with scraped images")
    p.add_argument("--csv", default="data/CNN_Model_Train_Data.csv", help="csv file with StockCode column")
    p.add_argument("--batch-size", type=int, default=16, help="batch size")
    p.add_argument("--epochs", type=int, default=20, help="epochs")
    p.add_argument("--image-size", type=int, nargs=2, default=[128, 128], help="image width height")
    return p.parse_args()


def dataset_summary(data_dir: str, csv_file: str):
    if not os.path.exists(data_dir):
        raise FileNotFoundError(f"data directory not found: {data_dir}")
    if not os.path.exists(csv_file):
        raise FileNotFoundError(f"csv file not found: {csv_file}")
    image_count = sum(1 for f in os.listdir(data_dir) if f.lower().endswith((".jpg", ".jpeg", ".png")))
    df = pd.read_csv(csv_file)
    if "StockCode" not in df.columns:
        raise ValueError("csv must contain 'StockCode' column")
    num_products = df["StockCode"].astype(str).nunique()
    avg_images_per_product = image_count / num_products if num_products > 0 else 0.0
    return {"image_count": image_count, "num_products": num_products, "avg_per_product": avg_images_per_product}


def print_dataset_advice(summary: dict):
    print("=" * 60)
    print("dataset summary:")
    print(f"  products: {summary['num_products']}")
    print(f"  images:   {summary['image_count']}")
    print(f"  avg/img:  {summary['avg_per_product']:.2f}")
    print("=" * 60)


def main():
    args = parse_args()
    try:
        print("cnn model training (from scratch)")
        print("=" * 60)
        summary = dataset_summary(args.data_dir, args.csv)
        print_dataset_advice(summary)
        width, height = args.image_size
        cnn = CNNModelService(image_size=(width, height), batch_size=args.batch_size, epochs=args.epochs)
        cnn.train_model(args.data_dir, args.csv)
        print("training completed. artifacts saved to models/")
    except Exception as e:
        print(f"error: {e}")
        traceback.print_exc()


if __name__ == "__main__":
    main()
