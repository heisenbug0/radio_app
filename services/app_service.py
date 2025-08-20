from .data_preparation import DataPreparationService
from .ocr_service import OCRService
from .cnn_model import CNNModelService
from pipelines.text_pipeline import TextQueryPipeline
from pipelines.ocr_pipeline import OCRPipeline
from pipelines.image_pipeline import ImageProductPipeline
from utils.types import TextQueryResult
import os
import tempfile
import re

class AppService:
    def __init__(self):
        self.data_service = DataPreparationService()
        self.ocr_service = OCRService()
        self.cnn_service = CNNModelService()
        self.text_pipeline = TextQueryPipeline(self.data_service)
        self.ocr_pipeline = OCRPipeline(self.ocr_service, self.data_service)
        self.image_pipeline = ImageProductPipeline(self.cnn_service, self.data_service)
        self.initialize_services()
    
    def initialize_services(self):
        """Initialize all services and load data"""
        try:
            # Initialize data preparation
            print("Initializing data preparation service...")
            self.data_service.clean_dataset("data/dataset.csv")
            self.data_service.create_product_vectors()
            self.data_service.upload_to_pinecone()
            
            print("Services initialized successfully")
        except Exception as e:
            print(f"Warning: Service initialization failed: {e}")
    
    def process_text_query(self, query: str) -> TextQueryResult:
        """text query -> products"""
        try:
            return self.text_pipeline.run(query)
        except Exception as e:
            return {"products": [], "response": f"error: {str(e)}"}
    
    def process_ocr_query(self, image_file) -> TextQueryResult:
        """image -> ocr -> products"""
        try:
            # Save uploaded image to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                image_file.save(temp_file.name)
                temp_path = temp_file.name
            
            try:
                return self.ocr_pipeline.run(image_path=temp_path)
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                    
        except Exception as e:
            return {"products": [], "response": f"error: {str(e)}", "extracted_text": ""}
    
    def process_image_product_search(self, image_file) -> TextQueryResult:
        """product image -> class -> products"""
        try:
            # Save uploaded image to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                image_file.save(temp_file.name)
                temp_path = temp_file.name
            
            try:
                return self.image_pipeline.run(temp_path)
                    
            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                    
        except Exception as e:
            return {"products": [], "response": f"error: {str(e)}", "predicted_class": "Unknown", "confidence": 0.0}