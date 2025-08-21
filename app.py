from flask import Flask, jsonify, render_template, request

from services.app_service import AppService

app = Flask(__name__)
app_service = AppService()

@app.route('/')
def index():
    """main page"""
    return render_template('index.html')

@app.route('/text-query', methods=['GET'])
def text_query_page():
    """text query page"""
    # text = 
    return render_template('text_query.html')

@app.route('/image-query', methods=['GET'])
def image_query_page():
    """image query page"""

    return render_template('image_query.html')

@app.route('/product-image', methods=['GET'])
def product_image_page():
    """product image upload page"""

    return render_template('product_image.html')

@app.route('/product-recommendation', methods=['POST'])
def product_recommendation():
    """text query to product recommendations"""
    try:
        query = request.form.get('query', '')
        # product_image = request.form.get()
        if not query:
            return jsonify({
                "products": [],
                "response": "Please provide a query param"
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
    """ocr image to text query then product recommendations"""
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
        
        # validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
        if not ('.' in image_file.filename and 
                image_file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({ "products": [],
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
    """product image to product suggestions"""
    try:
        if 'product_image' not in request.files:
            return jsonify({"products": [],
                "response": "No product image provided.",
                "predicted_class": "Unknown",
                "confidence": 0.0 }), 400
        
        image_file = request.files['product_image']
        if image_file.filename == '':
            return jsonify({
                "products": [],
                "response": "No product image selected.",
                "predicted_class": "Unknown",
                "confidence": 0.0 }), 400
        
        # validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
        if not ('.' in image_file.filename and 
                image_file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({
                "products": [],
                "response": "Invalid file type. Please upload an image file.",
                "predicted_class": "Unknown", "confidence": 0.0
            }), 400
        
        result = app_service.process_image_product_search(image_file)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "products": [],
            "response": f"An error occurred: {str(e)}",
            "predicted_class": "Unknown", "confidence": 0.0
        }), 500

@app.route('/sample_response', methods=['GET'])
def sample_response():
    """sample json response page"""
    return render_template('sample_response.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
