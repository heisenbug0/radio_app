from .data_preparation import DataPreparationService
from .ocr_service import OCRService
from .cnn_model import CNNModelService
from .image_caption_service import ImageCaptionService
from pipelines.text_pipeline import TextQueryPipeline
from pipelines.ocr_pipeline import OCRPipeline
from utils.types import TextQueryResult
import os
import tempfile
import re

class AppService:
    def __init__(self):
        self.data_service = DataPreparationService()
        self.ocr_service = OCRService()
        self.cnn_service = CNNModelService()
        self.image_search_service = None
        self.caption_service = ImageCaptionService()
        self.text_pipeline = TextQueryPipeline(self.data_service)
        self.ocr_pipeline = OCRPipeline(self.ocr_service, self.data_service)
        self.initialize_services()
    
    def initialize_services(self):
        """initialize all services and load data"""
        try:
            # init data preparation
            print("initializing data preparation service...")
            
            # check if dataset exists
            dataset_path = "data/dataset.csv"
            if os.path.exists(dataset_path):
                self.data_service.clean_dataset(dataset_path)
                self.data_service.create_product_vectors()
                self.data_service.upload_to_pinecone()
                try:
                    from .local_multimodal_search import LocalMultimodalSearchService
                    self.image_search_service = LocalMultimodalSearchService(self.data_service.products_df)
                    self.image_search_service.build_or_load_text_embeddings()
                    print("data preparation + local multimodal search initialized successfully")
                except Exception as mm_err:
                    print(f"warning: local multimodal search initialization failed: {mm_err}. continuing without it.")
            else:
                print("warning: dataset file not found. data preparation service will not be available.")
            
            print("services initialized successfully")
        except Exception as e:
            print(f"warning: service initialization failed: {e}")
            print("application will continue with limited functionality.")
    
    def process_text_query(self, query) -> TextQueryResult:
        """text -> products"""
        try:
            return self.text_pipeline.run(query, top_k=5)
        except Exception as e:
            return {
                "products": [],
                "response": f"error: {str(e)}"
            }
    
    def simplify_query(self, query):
        """simplify query by removing common words and keeping key terms"""
        # remove common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'}
        
        words = query.lower().split()
        key_words = [word for word in words if word not in stop_words and len(word) > 2]
        
        return ' '.join(key_words) if key_words else query
    
    def process_ocr_query(self, image_file) -> TextQueryResult:
        """process handwritten query from image using ocr"""
        try:
            # save image to temp
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                image_file.save(temp_file.name)
                temp_path = temp_file.name
            
            try:
                return self.ocr_pipeline.run(image_path=temp_path)
            
            finally:
                # clean up temp
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                    
        except Exception as e:
            return {
                "products": [],
                "response": f"error: {str(e)}",
                "extracted_text": ""
            }
    
    def process_image_product_search(self, image_file):
        """process product image to identify and recommend similar products"""
        try:
            # save image to temp
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                image_file.save(temp_file.name)
                temp_path = temp_file.name
            
            try:
                if self.image_search_service is not None:
                    products = self.image_search_service.search_by_image(temp_path, top_k=5)
                    if products:
                        # debug
                        try:
                            print("[MM_TOP] ", [(p["description"], round(float(p["similarity_score"]), 3)) for p in products])
                        except Exception:
                            pass
                        return {
                            "products": [
                                {
                                    "rank": p["rank"],
                                    "stock_code": p["stock_code"],
                                    "description": p["description"],
                                    "unit_price": p["unit_price"],
                                    "quantity": p["quantity"],
                                    "similarity_score": round(float(p["similarity_score"]), 3),
                                }
                                for p in products
                            ],
                            "response": "Results:",
                            "predicted_class": products[0]["description"],
                        }
                    else:
                        print("[MM_EMPTY] no multimodal matches for image.")
                        # try caption then text search
                        cap = self.caption_service.caption(temp_path)
                        if cap.get("success") and cap.get("caption"):
                            caption_text = cap["caption"].strip()
                            try:
                                print(f"[CAPTION] {caption_text}")
                            except Exception:
                                pass
                            products = self.data_service.search_products(caption_text, top_k=5)
                            if products:
                                return {
                                    "products": [
                                        {
                                            "rank": i,
                                            "stock_code": p['stock_code'],
                                            "description": p['description'],
                                            "unit_price": p['unit_price'],
                                            "quantity": p['quantity'],
                                            "similarity_score": round(p['similarity_score'], 3),
                                        }
                                        for i, p in enumerate(products, 1)
                                    ],
                                    "response": "Results:",
                                    "predicted_class": caption_text,
                                }
                        # debug
                        try:
                            zs = self.cnn_service.predict_product(temp_path)
                            print("[ZS_TOP3] ", zs.get('top_3_predictions'))
                        except Exception:
                            pass
 
                # fallback
                prediction_result = self.cnn_service.predict_product(temp_path)
                predicted_class = prediction_result.get('predicted_class', "Unknown")
                confidence = prediction_result.get('confidence', 0.0)
                predicted_label = None
                top3 = prediction_result.get('top_3_predictions') or []
                if top3 and isinstance(top3[0], dict):
                    predicted_label = top3[0].get('label') or None
                # debug
                try:
                    print("[ZS_TOP3] ", [(t.get('label'), round(float(t.get('confidence', 0.0)), 3)) for t in (top3 or [])])
                except Exception:
                    pass
                mapped_description = None
                try:
                    df = getattr(self.data_service, 'products_df', None)
                    if df is not None and not df.empty and predicted_class is not None:
                        subset = df[df['StockCode'].astype(str) == str(predicted_class)]
                        if not subset.empty:
                            mapped_description = str(subset.iloc[0]['Description'])
                except Exception:
                    mapped_description = None
                query_text = predicted_label or mapped_description or str(predicted_class)
                try:
                    print(f"[ZS_QUERY] query_text='{query_text}'")
                except Exception:
                    pass
                if re.search(r"\b(MISSING|MIXED\s*UP|UNKNOWN|N/?A|POSTAGE|CARRIAGE|SAMPLE|DAMAGED|BROKEN)\b", query_text, re.IGNORECASE):
                    return {
                        "products": [],
                        "response": "No products found.",
                        "predicted_class": predicted_class
                    }
                products = self.data_service.search_products(query_text, top_k=5)
                if products:
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
                        "response": "Results:",
                        "predicted_class": predicted_class,
                    }
                else:
                    try:
                        print(f"[ZS_NO_MATCH] query_text='{query_text}'")
                    except Exception:
                        pass
                    return {
                        "products": [],
                        "response": "No products found.",
                        "predicted_class": predicted_class
                    }
                    
            finally:
                # clean up temp
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                    
        except Exception as e:
            return {
                "products": [],
                "response": f"An error occurred while processing the product image: {str(e)}",
                "predicted_class": "Unknown"
            }