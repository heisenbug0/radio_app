# Product Recommendation System - Setup Guide

## Overview

This is a comprehensive product recommendation system with the following features:
- **Text-based product search** using natural language queries
- **OCR-based handwritten query processing** 
- **AI-powered product image recognition** using CNN
- **Vector database integration** for similarity search
- **Modern web interface** with three different interfaces

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Internet connection (for web scraping and optional Pinecone integration)

## Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Optional: Configure Pinecone (for cloud vector database)

If you want to use Pinecone for vector storage (recommended for production):

1. Sign up at [Pinecone](https://app.pinecone.io/)
2. Get your API key
3. Copy `.env.example` to `.env`
4. Add your Pinecone API key to `.env`:

```bash
cp .env.example .env
# Edit .env and add your Pinecone API key
```

### 3. Initialize the System

Run the setup script to prepare all components:

```bash
python setup.py
```

This will:
- Clean and prepare the dataset
- Create product vectors
- Optionally scrape product images for CNN training
- Train the CNN model (if data is available)
- Set up all necessary directories and files

### 4. Start the Application

```bash
python app.py
```

The application will be available at: http://localhost:5000

## Usage

### Text Query Interface
- Navigate to the Text Query Interface
- Enter natural language queries like "white hanging heart t-light holder"
- Get instant product recommendations

### Image Query Interface  
- Upload handwritten query images
- OCR extracts text from the image
- System processes the extracted text to find products

### Product Image Upload Interface
- Upload product images
- AI identifies the product using CNN
- Get similar product recommendations

## System Architecture

### Module 1: Data Preparation and Backend Setup
- Dataset cleaning and preprocessing
- Vector database creation (Pinecone/local)
- TF-IDF vectorization for product similarity

### Module 2: OCR and Web Scraping
- Tesseract OCR integration for text extraction
- Web scraping for product images (Amazon/Google)
- Image preprocessing for better OCR results

### Module 3: CNN Model Development
- Custom CNN model from scratch
- Product image classification
- Training on scraped product images

### Module 4: Frontend Development
- Three modern web interfaces
- Real-time AJAX communication
- Responsive design with drag-and-drop

## API Endpoints

- `POST /product-recommendation` - Text-based product search
- `POST /ocr-query` - OCR-based query processing  
- `POST /image-product-search` - Product image recognition
- `GET /` - Main interface
- `GET /text-query` - Text query interface
- `GET /image-query` - Image query interface
- `GET /product-image` - Product image upload interface

## Troubleshooting

### Common Issues

1. **Tesseract not found**: Install Tesseract OCR
   ```bash
   # Ubuntu/Debian
   sudo apt-get install tesseract-ocr
   
   # macOS
   brew install tesseract
   
   # Windows
   # Download from https://github.com/UB-Mannheim/tesseract/wiki
   ```

2. **Chrome WebDriver issues**: The system will fall back gracefully if web scraping fails

3. **Pinecone connection issues**: The system will use local storage if Pinecone is unavailable

4. **CNN model training fails**: A placeholder model will be created for basic functionality

### Performance Notes

- First startup may take longer due to data processing
- CNN model training requires sufficient training data
- Web scraping is optional and can be skipped for demo purposes

## Development

### Project Structure
```
├── app.py                 # Main Flask application
├── setup.py              # System initialization script
├── requirements.txt      # Python dependencies
├── services/            # Core service modules
│   ├── data_preparation.py
│   ├── ocr_service.py
│   ├── web_scraping.py
│   ├── cnn_model.py
│   └── app_service.py
├── templates/           # HTML templates
│   ├── index.html
│   ├── text_query.html
│   ├── image_query.html
│   └── product_image.html
├── data/               # Data files
│   ├── dataset.csv
│   └── CNN_Model_Train_Data.csv
└── models/             # Trained models (created during setup)
```

### Adding New Features

1. **New Service**: Add to `services/` directory
2. **New Endpoint**: Add route to `app.py`
3. **New Interface**: Create template in `templates/`
4. **Configuration**: Update `.env.example` and documentation

## License

This project is developed for educational and demonstration purposes.