# SerpAPI Setup Guide for Module 3

## What is SerpAPI?

SerpAPI is a service that provides access to search engine results (Google, Bing, etc.) through a simple API. We're using it to scrape product images for training the CNN model.

## Setup Steps

### 1. Get SerpAPI Key

1. Go to [serpapi.com](https://serpapi.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. **Free tier**: 100 searches per month (enough for testing)

### 2. Set Environment Variable

Add to your `.env` file:
```
SERPAPI_KEY=your_api_key_here
```

### 3. Install Dependencies

```bash
pip install google-search-results
```

## Usage

### Step 1: Scrape Product Images
```bash
python run_web_scraping.py
```

This will:
- Read product stock codes from `data/CNN_Model_Train_Data.csv`
- Search for 5 images per product using Google Images
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
- Check your SerpAPI key is correct
- Verify you have remaining API calls
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

- **SerpAPI**: Free tier = 100 searches/month
- **For 10 products × 5 images = 50 searches**
- **You can train multiple models with the free tier**

## Alternative APIs

If SerpAPI doesn't work, you can also use:
- **Bing Image Search API** (Microsoft)
- **Google Custom Search API**
- **Unsplash API** (for stock photos)

Let me know if you need help with any of these alternatives!