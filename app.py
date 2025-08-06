from flask import Flask, request, jsonify, render_template
from services.app_service import AppService
import os

app = Flask(__name__)
app_service = AppService()

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
    """
    Endpoint for product recommendations based on natural language queries.
    Input: Form data containing 'query' (string).
    Output: JSON with 'products' (array of objects) and 'response' (string).
    """
    try:
        query = request.form.get('query', '')
        if not query:
            return jsonify({
                "products": [],
                "response": "Please provide a query parameter."
            }), 400
        
        result = app_service.process_text_query(query)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "products": [],
            "response": f"An error occurred: {str(e)}"
        }), 500

@app.route('/ocr-query', methods=['POST'])
def ocr_query():
    """
    Endpoint to process handwritten queries extracted from uploaded images.
    Input: Form data containing 'image_data' (file upload).
    Output: JSON with 'products' (array of objects), 'response' (string), and 'extracted_text' (string).
    """
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
        
        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
        if not ('.' in image_file.filename and 
                image_file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({
                "products": [],
                "response": "Invalid file type. Please upload an image file.",
                "extracted_text": ""
            }), 400
        
        result = app_service.process_ocr_query(image_file)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "products": [],
            "response": f"An error occurred: {str(e)}",
            "extracted_text": ""
        }), 500

@app.route('/image-product-search', methods=['POST'])
def image_product_search():
    """
    Endpoint to identify and suggest products from uploaded product images.
    Input: Form data containing 'product_image' (file upload).
    Output: JSON with 'products' (array of objects), 'response' (string), 'predicted_class' (string), and 'confidence' (float).
    """
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
        
        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
        if not ('.' in image_file.filename and 
                image_file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({
                "products": [],
                "response": "Invalid file type. Please upload an image file.",
                "predicted_class": "Unknown",
                "confidence": 0.0
            }), 400
        
        result = app_service.process_image_product_search(image_file)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "products": [],
            "response": f"An error occurred: {str(e)}",
            "predicted_class": "Unknown",
            "confidence": 0.0
        }), 500

@app.route('/sample_response', methods=['GET'])
def sample_response():
    """
    Endpoint to return a sample JSON response for the API.
    Output: JSON with 'products' (array of objects) and 'response' (string).
    """
    return render_template('sample_response.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
