from flask import Flask, request, jsonify, render_template
import os
import re
import json
import csv
from collections import defaultdict

app = Flask(__name__)

# Simple in-memory data storage
products_data = []
product_vectors = {}

def load_data():
    """Load and clean the dataset"""
    global products_data
    
    try:
        with open('data/dataset.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Clean the data
                stock_code = re.sub(r'[^\w\s-]', '', str(row.get('StockCode', '')).strip())
                description = re.sub(r'[^\w\s-]', '', str(row.get('Description', '')).strip())
                
                if description and len(description) > 0:
                    products_data.append({
                        'stock_code': stock_code,
                        'description': description,
                        'unit_price': float(row.get('UnitPrice', 0)),
                        'quantity': int(row.get('Quantity', 0))
                    })
        
        # Remove duplicates
        seen = set()
        unique_products = []
        for product in products_data:
            key = (product['stock_code'], product['description'])
            if key not in seen:
                seen.add(key)
                unique_products.append(product)
        
        products_data = unique_products
        print(f"Loaded {len(products_data)} unique products")
        
    except Exception as e:
        print(f"Error loading data: {e}")
        # Create sample data if file not found
        products_data = [
            {'stock_code': '85123A', 'description': 'WHITE HANGING HEART T-LIGHT HOLDER', 'unit_price': 2.55, 'quantity': 6},
            {'stock_code': '71053', 'description': 'WHITE METAL LANTERN', 'unit_price': 3.39, 'quantity': 6},
            {'stock_code': '84406B', 'description': 'CREAM CUPID HEARTS COAT HANGER', 'unit_price': 2.75, 'quantity': 8},
            {'stock_code': '84029G', 'description': 'KNITTED UNION FLAG HOT WATER BOTTLE', 'unit_price': 3.39, 'quantity': 6},
        ]

def simple_similarity(query, product_text):
    """Simple text similarity using word overlap"""
    query_words = set(query.lower().split())
    product_words = set(product_text.lower().split())
    
    if not query_words:
        return 0
    
    intersection = query_words.intersection(product_words)
    union = query_words.union(product_words)
    
    return len(intersection) / len(union) if union else 0

def search_products(query, top_k=5):
    """Search for products using simple text similarity"""
    if not query or len(query.strip()) < 2:
        return []
    
    query = query.strip()
    results = []
    
    for product in products_data:
        # Combine stock code and description for search
        product_text = f"{product['stock_code']} {product['description']}"
        similarity = simple_similarity(query, product_text)
        
        if similarity > 0:
            results.append({
                **product,
                'similarity_score': similarity
            })
    
    # Sort by similarity score and return top k
    results.sort(key=lambda x: x['similarity_score'], reverse=True)
    return results[:top_k]

def extract_text_from_image_simple(image_file):
    """Simple OCR simulation - returns a placeholder text"""
    # In a real implementation, this would use Tesseract OCR
    # For demo purposes, we'll return a sample text
    sample_texts = [
        "white hanging heart",
        "metal lantern",
        "cupid hearts",
        "hot water bottle"
    ]
    import random
    return random.choice(sample_texts)

def predict_product_from_image_simple(image_file):
    """Simple product prediction simulation"""
    # In a real implementation, this would use a trained CNN model
    # For demo purposes, we'll return a random product
    if products_data:
        import random
        product = random.choice(products_data)
        return {
            'predicted_class': product['stock_code'],
            'confidence': 0.85
        }
    return {
        'predicted_class': 'UNKNOWN',
        'confidence': 0.0
    }

# Load data on startup
load_data()

@app.route('/')
def index():
    """Main page with links to all interfaces"""
    return render_template('index.html')

@app.route('/text-query')
def text_query():
    """Text query interface page"""
    return render_template('text_query.html')

@app.route('/image-query')
def image_query():
    """Image query interface page"""
    return render_template('image_query.html')

@app.route('/product-image')
def product_image():
    """Product image upload interface page"""
    return render_template('product_image.html')

@app.route('/product-recommendation', methods=['POST'])
def product_recommendation():
    """Text-based product recommendations"""
    try:
        query = request.form.get('query', '')
        if not query:
            return jsonify({
                "products": [],
                "response": "Please provide a query parameter."
            }), 400
        
        # Check for sensitive content
        sensitive_patterns = [
            r'\b(password|secret|private|confidential)\b',
            r'\b(admin|root|sudo)\b',
            r'\b(credit\s*card|ssn|social\s*security)\b'
        ]
        
        for pattern in sensitive_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return jsonify({
                    "products": [],
                    "response": "I cannot process queries containing sensitive information."
                }), 400
        
        # Search for products
        products = search_products(query, top_k=5)
        
        # Generate response
        if products:
            response = f"I found {len(products)} products matching your query '{query}'. Here are the top recommendations:"
            
            # Format products for response
            formatted_products = []
            for i, product in enumerate(products, 1):
                formatted_product = {
                    "rank": i,
                    "stock_code": product['stock_code'],
                    "description": product['description'],
                    "unit_price": product['unit_price'],
                    "quantity": product['quantity'],
                    "similarity_score": round(product['similarity_score'], 3)
                }
                formatted_products.append(formatted_product)
            
            return jsonify({
                "products": formatted_products,
                "response": response
            })
        else:
            return jsonify({
                "products": [],
                "response": f"I couldn't find any products matching your query '{query}'. Please try different keywords."
            })
            
    except Exception as e:
        return jsonify({
            "products": [],
            "response": f"An error occurred: {str(e)}"
        }), 500

@app.route('/ocr-query', methods=['POST'])
def ocr_query():
    """OCR-based query processing"""
    try:
        if 'image_data' not in request.files:
            return jsonify({
                "products": [],
                "response": "No image file provided.",
                "extracted_text": ""
            }), 400
        
        image_file = request.files['image_data']
        if image_file.filename == '':
            return jsonify({
                "products": [],
                "response": "No image file selected.",
                "extracted_text": ""
            }), 400
        
        # Extract text (simulated OCR)
        extracted_text = extract_text_from_image_simple(image_file)
        
        # Search for products using extracted text
        products = search_products(extracted_text, top_k=5)
        
        # Generate response
        if products:
            response = f"I extracted '{extracted_text}' from your image and found {len(products)} matching products:"
            
            formatted_products = []
            for i, product in enumerate(products, 1):
                formatted_product = {
                    "rank": i,
                    "stock_code": product['stock_code'],
                    "description": product['description'],
                    "unit_price": product['unit_price'],
                    "quantity": product['quantity'],
                    "similarity_score": round(product['similarity_score'], 3)
                }
                formatted_products.append(formatted_product)
            
            return jsonify({
                "products": formatted_products,
                "response": response,
                "extracted_text": extracted_text
            })
        else:
            return jsonify({
                "products": [],
                "response": f"I extracted '{extracted_text}' from your image but couldn't find matching products.",
                "extracted_text": extracted_text
            })
            
    except Exception as e:
        return jsonify({
            "products": [],
            "response": f"An error occurred: {str(e)}",
            "extracted_text": ""
        }), 500

@app.route('/image-product-search', methods=['POST'])
def image_product_search():
    """Product image recognition and recommendations"""
    try:
        if 'product_image' not in request.files:
            return jsonify({
                "products": [],
                "response": "No product image provided.",
                "predicted_class": "Unknown",
                "confidence": 0.0
            }), 400
        
        image_file = request.files['product_image']
        if image_file.filename == '':
            return jsonify({
                "products": [],
                "response": "No product image selected.",
                "predicted_class": "Unknown",
                "confidence": 0.0
            }), 400
        
        # Predict product class (simulated CNN)
        prediction = predict_product_from_image_simple(image_file)
        predicted_class = prediction['predicted_class']
        confidence = prediction['confidence']
        
        # Search for similar products
        products = search_products(predicted_class, top_k=5)
        
        # Generate response
        if confidence > 0.7:
            response = f"I identified this product as '{predicted_class}' with {confidence:.1%} confidence. "
        else:
            response = f"I tentatively identified this product as '{predicted_class}' with {confidence:.1%} confidence. "
        
        if products:
            response += f"Here are similar products:"
            
            formatted_products = []
            for i, product in enumerate(products, 1):
                formatted_product = {
                    "rank": i,
                    "stock_code": product['stock_code'],
                    "description": product['description'],
                    "unit_price": product['unit_price'],
                    "quantity": product['quantity'],
                    "similarity_score": round(product['similarity_score'], 3)
                }
                formatted_products.append(formatted_product)
            
            return jsonify({
                "products": formatted_products,
                "response": response,
                "predicted_class": predicted_class,
                "confidence": round(confidence, 3)
            })
        else:
            return jsonify({
                "products": [],
                "response": response + " However, I couldn't find similar products in our database.",
                "predicted_class": predicted_class,
                "confidence": round(confidence, 3)
            })
            
    except Exception as e:
        return jsonify({
            "products": [],
            "response": f"An error occurred: {str(e)}",
            "predicted_class": "Unknown",
            "confidence": 0.0
        }), 500

@app.route('/sample_response', methods=['GET'])
def sample_response():
    """Sample response page"""
    return render_template('sample_response.html')

if __name__ == '__main__':
    print("🚀 Starting Product Recommendation System...")
    print(f"📊 Loaded {len(products_data)} products")
    print("🌐 Application will be available at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)