# Implementation Guide - E-commerce Product Recommendation System

This guide provides step-by-step instructions to implement all tasks from the README and fix the current errors.

## Current Issues Fixed

1. **Pinecone API Error**: Updated to support both old and new Pinecone APIs
2. **Aggregation Error**: Fixed data type issues in pandas groupby operations
3. **Missing Environment Variables**: Added proper error handling for missing Pinecone API key
4. **Service Initialization**: Made services more robust with graceful error handling

## Task Implementation Status

### ✅ Module 1: Data Preparation and Backend Setup

#### Task 1: E-commerce Dataset Cleaning
- **Status**: ✅ Implemented
- **File**: `services/data_preparation.py`
- **Features**:
  - Removes duplicates
  - Handles missing values
  - Standardizes formats
  - Cleans StockCode and Description columns

#### Task 2: Vector Database Creation
- **Status**: ✅ Implemented
- **File**: `services/data_preparation.py`
- **Features**:
  - Pinecone integration with fallback to local storage
  - Supports both old and new Pinecone APIs
  - Automatic index creation

#### Task 3: Similarity Metrics Selection
- **Status**: ✅ Implemented
- **File**: `services/data_preparation.py`
- **Features**:
  - Cosine similarity for text-based matching
  - TF-IDF vectorization
  - Configurable similarity metrics

#### Endpoint 1: Product Recommendation Service
- **Status**: ✅ Implemented
- **File**: `app.py` (route: `/product-recommendation`)
- **Features**:
  - Natural language query processing
  - Safeguards against sensitive data
  - Product matching with similarity scores

### ✅ Module 2: OCR and Web Scraping

#### Task 4: OCR Functionality Implementation
- **Status**: ✅ Implemented
- **File**: `services/ocr_service.py`
- **Features**:
  - Tesseract OCR integration
  - Image preprocessing for better accuracy
  - Text cleaning and validation

#### Task 5: Web Scraping for Product Images
- **Status**: ✅ Implemented
- **File**: `services/web_scraping.py` + `run_web_scraping.py`
- **Features**:
  - Automated scraping from Amazon and Google
  - Systematic image storage
  - Configurable images per product

#### Endpoint 2: OCR-Based Query Processing
- **Status**: ✅ Implemented
- **File**: `app.py` (route: `/ocr-query`)
- **Features**:
  - Handwritten query extraction
  - Same logic as Endpoint 1
  - Returns extracted text

### ✅ Module 3: CNN Model Development

#### Task 6: CNN Model Training
- **Status**: ✅ Implemented
- **File**: `services/cnn_model.py` + `train_cnn_model.py`
- **Features**:
  - CNN model from scratch (no pre-trained models)
  - Training on scraped images
  - Model persistence and loading

#### Endpoint 3: Image-Based Product Detection
- **Status**: ✅ Implemented
- **File**: `app.py` (route: `/image-product-search`)
- **Features**:
  - Product identification from images
  - CNN model integration
  - Returns predicted class and confidence

### ✅ Module 4: Frontend Development and Integration

#### Frontend Pages
- **Status**: ✅ Implemented
- **Files**: `templates/` directory
- **Features**:
  - Text Query Interface (`text_query.html`)
  - Image Query Interface (`image_query.html`)
  - Product Image Upload Interface (`product_image.html`)

## Setup Instructions

### 1. Environment Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Create environment file (optional - for Pinecone)
cp .env.example .env
# Edit .env and add your Pinecone API key if available
```

### 2. Data Preparation

```bash
# Run setup script to initialize all services
python setup_services.py
```

### 3. Web Scraping (Task 5)

```bash
# Scrape product images for training
python run_web_scraping.py
```

### 4. CNN Model Training (Task 6)

```bash
# Train the CNN model
python train_cnn_model.py
```

### 5. Start Application

```bash
# Start the Flask application
python app.py
```

## API Endpoints

### 1. Product Recommendation (`POST /product-recommendation`)
- **Input**: Form data with 'query' field
- **Output**: JSON with products array and natural language response

### 2. OCR Query Processing (`POST /ocr-query`)
- **Input**: Form data with 'image_data' file upload
- **Output**: JSON with products, response, and extracted text

### 3. Image Product Search (`POST /image-product-search`)
- **Input**: Form data with 'product_image' file upload
- **Output**: JSON with products, response, predicted class, and confidence

## File Structure

```
├── app.py                          # Main Flask application
├── setup_services.py               # Service initialization script
├── run_web_scraping.py             # Web scraping script (Task 5)
├── train_cnn_model.py              # CNN training script (Task 6)
├── services/
│   ├── data_preparation.py         # Tasks 1-3, Endpoint 1
│   ├── ocr_service.py              # Task 4, Endpoint 2
│   ├── web_scraping.py             # Task 5
│   ├── cnn_model.py                # Task 6, Endpoint 3
│   └── app_service.py              # Main service orchestrator
├── templates/                      # Frontend pages (Module 4)
├── data/
│   ├── dataset.csv                 # Main e-commerce dataset
│   ├── CNN_Model_Train_Data.csv    # Product classes for CNN
│   └── scraped_images/             # Scraped product images
└── models/                         # Trained CNN models
```

## Error Resolution

### Pinecone Issues
- **Problem**: "module 'pinecone' has no attribute 'init'"
- **Solution**: Updated code to support both old and new Pinecone APIs
- **Fallback**: Local storage when Pinecone is unavailable

### Aggregation Issues
- **Problem**: "agg function failed [how->mean,dtype->object]"
- **Solution**: Added proper data type conversion for numeric columns
- **Fix**: `pd.to_numeric()` with error handling

### Service Initialization
- **Problem**: Services fail to initialize
- **Solution**: Added graceful error handling and fallbacks
- **Result**: Application continues with limited functionality

## Testing

### Manual Testing
1. Start the application: `python app.py`
2. Visit `http://localhost:5000`
3. Test each interface:
   - Text query interface
   - Image query interface (upload handwritten text)
   - Product image interface (upload product images)

### API Testing
```bash
# Test product recommendation
curl -X POST -F "query=red shoes" http://localhost:5000/product-recommendation

# Test OCR query (upload image file)
curl -X POST -F "image_data=@handwritten_query.jpg" http://localhost:5000/ocr-query

# Test image product search (upload product image)
curl -X POST -F "product_image=@product.jpg" http://localhost:5000/image-product-search
```

## Performance Considerations

1. **Vector Database**: Pinecone for production, local storage for development
2. **CNN Model**: Trained on scraped images, saved for reuse
3. **OCR**: Optimized preprocessing for better accuracy
4. **Web Scraping**: Respectful delays and error handling

## Security Features

1. **Input Validation**: All endpoints validate input data
2. **Sensitive Data Filtering**: Blocks queries containing sensitive information
3. **File Type Validation**: Only allows image uploads
4. **Error Handling**: Graceful error responses without exposing internals

## Next Steps

1. **Production Deployment**: Configure proper environment variables
2. **Model Optimization**: Fine-tune CNN model parameters
3. **Data Enhancement**: Add more product images for better training
4. **Performance Monitoring**: Add logging and metrics
5. **Documentation**: Create video demonstrations as required

## Troubleshooting

### Common Issues

1. **Tesseract not found**: Install Tesseract OCR on your system
2. **Chrome WebDriver issues**: Install Chrome/Chromium browser
3. **Memory issues**: Reduce batch sizes in CNN training
4. **Pinecone errors**: Check API key and environment settings

### Debug Mode
```bash
# Run with debug information
FLASK_DEBUG=1 python app.py
```

This implementation addresses all tasks from the README while fixing the current errors and providing a robust, production-ready system.