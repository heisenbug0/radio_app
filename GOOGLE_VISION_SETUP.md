# Google Cloud Vision API Setup Guide

## Why Google Cloud Vision API?

Google Cloud Vision API is one of the most advanced OCR solutions available in 2025, offering:

- **Superior Accuracy**: Much better than Tesseract for handwriting and complex text
- **Multiple Language Support**: Handles various languages and scripts
- **Handwriting Recognition**: Excellent for handwritten text
- **Layout Analysis**: Understands text positioning and structure
- **Production Ready**: Used by major companies worldwide

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Cloud Vision API:
   - Go to "APIs & Services" > "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"

### 2. Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name (e.g., "vision-api-service")
4. Grant "Cloud Vision API User" role
5. Create and download the JSON key file

### 3. Set Environment Variable

Set the path to your service account key:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
```

Or add to your `.env` file:
```
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
```

### 4. Install Dependencies

```bash
pip install google-cloud-vision
```

## Usage

The OCR service will automatically use Google Cloud Vision API when credentials are properly set up. If not available, it will show a warning message.

## Cost

- First 1,000 requests per month: Free
- Additional requests: $1.50 per 1,000 requests
- Very cost-effective for most applications

## Alternative: Azure Computer Vision

If you prefer Microsoft's solution, you can also use Azure Computer Vision API which offers similar capabilities.

## Fallback

If Google Cloud Vision is not available, the system will show an error message asking to set up the credentials.