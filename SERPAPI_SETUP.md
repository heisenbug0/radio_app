# Pixabay Setup Guide for Module 3

## What is Pixabay?

Pixabay provides a free image API that we use to download training images for the CNN model.

## Setup Steps

### 1. Get Pixabay API Key

1. Go to [pixabay.com/api/docs](https://pixabay.com/api/docs/)
2. Sign up and generate an API key
3. **Free tier**: generous quota, typically 5000 requests/hour

### 2. Set Environment Variable

Add to your `.env` file:
```
PIXABAY_API_KEY=your_api_key_here
```

### 3. Install Dependencies

No extra packages are needed beyond `requests` and `python-dotenv`.

## Usage

### Step 1: Scrape Product Images (Pixabay)
```bash
python run_web_scraping.py
```

This will:
- Read product stock codes from `data/CNN_Model_Train_Data.csv`
- Generate robust search queries from full product names
- Auto-allocate images per product based on Pixabay’s free API limits
- Download images to `data/scraped_images/`
- Save scraping results to `data/scraped_images/scraping_results.csv`

### Step 2: Train CNN Model
```bash
python train_cnn_model.py
```

This will:
- Load scraped images
- Train a CNN model from scratch
- Save model to `models/product_cnn_model.h5`
- Generate training history plot

### Step 3: Test Product Recognition
Upload a product image through the web interface to test the trained model.

## Expected Results

- **Images per product**: 5 images (configurable)
- **Training time**: 10-30 minutes depending on data size
- **Model accuracy**: 70-90% depending on image quality and variety
- **Prediction confidence**: 0.0-1.0 (higher is better)

## Troubleshooting

### No Images Downloaded
- Check your Pixabay key is correct
- Verify you have remaining API quota
- Check internet connection

### Low Model Accuracy
- Ensure you have enough images per product (5+)
- Check image quality and variety
- Consider increasing training epochs

### Model Training Errors
- Ensure TensorFlow/Keras versions are compatible
- Check available RAM (model needs ~2-4GB)
- Verify image files are not corrupted

## Cost

- **Pixabay**: Free tier is sufficient for prototyping and small datasets

We use only Pixabay for this project to keep things simple and reliable.

Let me know if you need help with any of these alternatives!