#!/usr/bin/env python3
"""
Fixed training script for the CNN model.

Changes / fixes made here:
- Accepts CLI flags for debug / overfit / mixup / ema / warmup / batch size.
- Instantiates CNNModelService with parameters (debug, use_mixup, use_cutmix, enable_ema).
- Uses consistent model filenames (.keras) to match the service save/load behavior.
- Provides an optional overfit test (quick sanity check) that attempts to memorize a tiny subset.
- Better dataset checks and clearer printed guidance.
- Graceful error handling with stack trace for debugging.

Usage examples:
  # Normal train
  python run_train.py

  # With debug (lighter head, easier to overfit)
  python run_train.py --debug

  # Run overfit test (will attempt to memorize few images per class)
  python run_train.py --overfit

  # Enable EMA snapshot and mixup
  python run_train.py --enable-ema --use-mixup
"""

import os
import argparse
import traceback
import pandas as pd

from services.cnn_model import CNNModelService


def parse_args():
    p = argparse.ArgumentParser(description="Train product CNN (fixed script).")
    p.add_argument("--data-dir", default="data/scraped_images", help="Directory with scraped images")
    p.add_argument("--csv", default="data/CNN_Model_Train_Data.csv", help="CSV file with StockCode column")
    p.add_argument("--warmup-epochs", type=int, default=10, help="Number of warmup epochs")
    p.add_argument("--batch-size", type=int, default=16, help="Batch size for training")
    p.add_argument("--debug", action="store_true", help="Enable debug mode (lighter head; useful for overfitting test)")
    p.add_argument("--overfit", action="store_true", help="Run overfit test instead of full training")
    p.add_argument("--use-mixup", action="store_true", help="Enable mixup augmentation")
    p.add_argument("--use-cutmix", action="store_true", help="Enable cutmix augmentation (if implemented)")
    p.add_argument("--enable-ema", action="store_true", help="Enable EMA callback and save EMA snapshot")
    p.add_argument("--epochs", type=int, default=200, help="Total epochs (affects scheduling; head/fine-tune controlled in service)")
    return p.parse_args()


def dataset_summary(data_dir: str, csv_file: str):
    if not os.path.exists(data_dir):
        raise FileNotFoundError(f"Data directory not found: {data_dir}")
    if not os.path.exists(csv_file):
        raise FileNotFoundError(f"CSV file not found: {csv_file}")

    # Count images
    image_count = sum(1 for f in os.listdir(data_dir) if f.lower().endswith((".jpg", ".jpeg", ".png")))
    df = pd.read_csv(csv_file)
    if "StockCode" not in df.columns:
        raise ValueError("CSV file must contain a 'StockCode' column.")
    num_products = df["StockCode"].astype(str).nunique()
    avg_images_per_product = image_count / num_products if num_products > 0 else 0.0

    return {
        "image_count": image_count,
        "num_products": num_products,
        "avg_images_per_product": avg_images_per_product,
    }


def print_dataset_advice(summary: dict):
    image_count = summary["image_count"]
    num_products = summary["num_products"]
    avg_images_per_product = summary["avg_images_per_product"]

    print("=" * 80)
    print("Dataset summary:")
    print(f"  Products (unique StockCode): {num_products}")
    print(f"  Total images found:           {image_count}")
    print(f"  Avg images per product:       {avg_images_per_product:.2f}")
    print("=" * 80)

    if num_products < 50:
        print("⚠️  Small product count detected. Expect training to be harder. Suggestions:")
        print("   - Use heavier augmentation (we do augmentation in-model).")
        print("   - Use debug mode / overfit test to validate pipeline.")
        print("   - Consider collecting more images or using few-shot approaches.")
    elif num_products < 100:
        print("⚠️  Medium product count — reasonable for transfer learning.")
    else:
        print("✅ Dataset product count looks healthy.")

    if avg_images_per_product < 3:
        print("⚠️  Low images per product — mixup/cutmix might hurt; use with care.")
    elif avg_images_per_product < 5:
        print("⚠️  Moderate images per product — should be OK with transfer learning.")
    else:
        print("✅ Good images per product.")


def main():
    args = parse_args()

    try:
        print("CNN Model Training (fixed script)")
        print("=" * 80)

        summary = dataset_summary(args.data_dir, args.csv)
        print_dataset_advice(summary)

        # Instantiate service with chosen options
        cnn_service = CNNModelService(
            image_size=(299, 299),
            batch_size=args.batch_size,
            epochs=args.epochs,
            debug=args.debug,
            use_mixup=args.use_mixup,
            use_cutmix=args.use_cutmix,
            enable_ema=args.enable_ema,
        )

        # If user requested an overfit test, run it and exit
        if args.overfit:
            # Use a small per-class count so this runs quickly
            per_class = 5
            epochs = 200
            print(f"\nRunning overfit test: using up to {per_class} images/class for {epochs} epochs")
            cnn_service.overfit_test(args.data_dir, args.csv, per_class=per_class, epochs=epochs)
            print("\nOverfit test complete. If training accuracy didn't reach ~100%, inspect labels & preprocessing.")
            return

        print("\nStarting full training run with the following options:")
        print(f"  warmup_epochs: {args.warmup_epochs}")
        print(f"  batch_size:    {args.batch_size}")
        print(f"  debug:         {args.debug}")
        print(f"  mixup:         {args.use_mixup}")
        print(f"  cutmix:        {args.use_cutmix}")
        print(f"  EMA:           {args.enable_ema}")
        print("")

        # Train the model (this call will save model to models/product_cnn_model.keras)
        history = cnn_service.train_model(args.data_dir, args.csv, warmup_epochs=args.warmup_epochs, ema_decay=0.9999)

        print("\nTraining completed.")
        print("Saved artifacts (check models/):")
        for fn in sorted(os.listdir("models")) if os.path.exists("models") else []:
            print("  -", os.path.join("models", fn))

        # Inform about expected filenames (service uses native Keras .keras format)
        print("\nModel filenames to look for:")
        print("  - models/product_cnn_model.keras")
        if args.enable_ema:
            print("  - models/product_cnn_model_ema.keras")

        print("\nNext steps:")
        print("  1) Run predictions using `cnn_service.predict_product(image_path)`")
        print("  2) If validation accuracy remains at random baseline, run the overfit test to verify pipeline:")
        print("       python run_train.py --overfit")
        print("  3) Inspect sample images & label mapping if overfit fails.")

    except Exception as e:
        print(f"Error during training script execution: {e}")
        traceback.print_exc()


if __name__ == "__main__":
    main()
