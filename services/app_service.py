from .data_preparation import DataPreparationService
from .ocr_service import OCRService
from .cnn_model import CNNModelService
import os
import tempfile
import re

class AppService:
    def __init__(self):
        self.data_service = DataPreparationService()
        self.ocr_service = OCRService()
        self.cnn_service = CNNModelService()
        self.initialize_services()
    
    def initialize_services(self):
        """Initialize all services and load data"""
        try:
            # Initialize data preparation
            print("Initializing data preparation service...")
            
            # Check if dataset exists
            dataset_path = "data/dataset.csv"
            if os.path.exists(dataset_path):
                self.data_service.clean_dataset(dataset_path)
                self.data_service.create_product_vectors()
                self.data_service.upload_to_pinecone()
                print("Data preparation service initialized successfully")
            else:
                print("Warning: Dataset file not found. Data preparation service will not be available.")
            
            print("Services initialized successfully")
        except Exception as e:
            print(f"Warning: Service initialization failed: {e}")
            print("Application will continue with limited functionality.")
    
    def process_text_query(self, query):
        """Process natural language text query and return product recommendations"""
        try:
            # Validate query
            if not query or len(query.strip()) < 2:
                return {
                    "products": [],
                    "response": "Please provide a valid query with at least 2 characters."
                }
            
            # Check for sensitive content
            sensitive_patterns = [
                r'\b(password|secret|private|confidential)\b',
                r'\b(admin|root|sudo)\b',
                r'\b(credit\s*card|ssn|social\s*security)\b'
            ]
            
            for pattern in sensitive_patterns:
                if re.search(pattern, query, re.IGNORECASE):
                    return {
                        "products": [],
                        "response": "I cannot process queries containing sensitive information."
                    }
            
            # Search for products
            products = self.data_service.search_products(query, top_k=5)
            
            # Generate natural language response
            if products:
                response = f"I found {len(products)} products matching your query '{query}'. "
                response += "Here are the top recommendations:"
                
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
                
                return {
                    "products": formatted_products,
                    "response": response
                }
            else:
                return {
                    "products": [],
                    "response": f"I couldn't find any products matching your query '{query}'. Please try different keywords."
                }
                
        except Exception as e:
            return {
                "products": [],
                "response": f"An error occurred while processing your query: {str(e)}"
            }
    
    def process_ocr_query(self, image_file):
        """Process handwritten query from image using OCR"""
        try:
            # Save uploaded image to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                image_file.save(temp_file.name)
                temp_path = temp_file.name
            
            try:
                # Extract text using OCR
                ocr_result = self.ocr_service.extract_text(image_path=temp_path)
                
                if not ocr_result['success']:
                    return {
                        "products": [],
                        "response": f"Failed to extract text from image: {ocr_result['error']}",
                        "extracted_text": ""
                    }
                
                extracted_text = ocr_result['extracted_text']
                
                # Validate extracted text
                is_valid, validation_message = self.ocr_service.validate_query(extracted_text)
                
                if not is_valid:
                    return {
                        "products": [],
                        "response": f"Extracted text validation failed: {validation_message}",
                        "extracted_text": extracted_text
                    }
                
                # Process the extracted text as a normal query
                query_result = self.process_text_query(extracted_text)
                query_result["extracted_text"] = extracted_text
                
                return query_result
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                    
        except Exception as e:
            return {
                "products": [],
                "response": f"An error occurred while processing the image: {str(e)}",
                "extracted_text": ""
            }
    
    def process_image_product_search(self, image_file):
        """Process product image to identify and recommend similar products"""
        try:
            # Save uploaded image to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                image_file.save(temp_file.name)
                temp_path = temp_file.name
            
            try:
                # Predict product class using CNN
                prediction_result = self.cnn_service.predict_product(temp_path)
                
                if prediction_result is None:
                    return {
                        "products": [],
                        "response": "Failed to identify product from image. Please try a different image.",
                        "predicted_class": "Unknown"
                    }
                
                predicted_class = prediction_result['predicted_class']
                confidence = prediction_result['confidence']
                
                # Search for similar products using the predicted class
                products = self.data_service.search_products(predicted_class, top_k=5)
                
                # Generate response
                if confidence > 0.7:
                    response = f"I identified this product as '{predicted_class}' with {confidence:.1%} confidence. "
                else:
                    response = f"I tentatively identified this product as '{predicted_class}' with {confidence:.1%} confidence. "
                
                if products:
                    response += f"Here are similar products:"
                    
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
                    
                    return {
                        "products": formatted_products,
                        "response": response,
                        "predicted_class": predicted_class,
                        "confidence": round(confidence, 3)
                    }
                else:
                    return {
                        "products": [],
                        "response": response + " However, I couldn't find similar products in our database.",
                        "predicted_class": predicted_class,
                        "confidence": round(confidence, 3)
                    }
                    
            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                    
        except Exception as e:
            return {
                "products": [],
                "response": f"An error occurred while processing the product image: {str(e)}",
                "predicted_class": "Unknown",
                "confidence": 0.0
            }