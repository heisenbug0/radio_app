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

If you also have a SerpAPI key, the scraper will prefer it automatically:
```
SERPAPI_API_KEY=your_serpapi_key_here
```

### 3. Install Dependencies

No extra packages are needed beyond `requests` and `python-dotenv` (already in `requirements.txt`).

## Usage

### Step 1: Scrape Product Images (Pixabay or SerpAPI)
```bash
python run_web_scraping.py
```

This will:
- Read product stock codes from `data/CNN_Model_Train_Data.csv`
- Generate robust search queries from full product names
- Auto-allocate images per product based on API limits
- Download images to `data/scraped_images/`
- Save scraping results to `data/scraped_images/scraping_results.csv`

### Optional: Zero-shot classification (no training)
You can skip training by enabling a free API-based zero-shot classifier:
```
USE_HF_ZERO_SHOT=true
# Optional but recommended to avoid cold start rate limits:
HUGGINGFACE_API_TOKEN=your_token
# Optional model override (default shown):
HF_ZERO_SHOT_MODEL=openai/clip-vit-base-patch32
```

### Step 2: Train CNN Model (if not using zero-shot)
```bash
python train_cnn_model.py
```

This will:
- Load scraped images
- Train a CNN model from scratch
- Save model to `models/product_cnn_model.keras`
- Generate training history plot

### Step 3: Test Product Recognition
Upload a product image through the web interface to test the model or the zero-shot fallback.

## Troubleshooting

### No Images Downloaded
- Check your Pixabay key is correct
- Verify you have remaining API quota
- Check internet connection

### Zero-shot API errors
- Add a `HUGGINGFACE_API_TOKEN` for higher rate limits and faster cold starts
- Reduce candidate labels with `HF_MAX_CANDIDATE_LABELS=50`

### Low Model Accuracy (when training)
- Ensure you have enough images per product (5+)
- Check image quality and variety
- Consider increasing training epochs

### Model Training Errors
- Ensure TensorFlow/Keras versions are compatible
- Check available RAM (model needs ~2-4GB)
- Verify image files are not corrupted

## Cost

- **Pixabay**: Free tier is sufficient for prototyping and small datasets
- **Hugging Face Inference API**: Free tier with rate limits; works without a token but benefits from providing one

We use Pixabay/SerpAPI for scraping and Hugging Face for zero-shot classification to keep things simple and reliable.