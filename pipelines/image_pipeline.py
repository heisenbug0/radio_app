from typing import Optional
from services.cnn_model import CNNModelService
from services.data_preparation import DataPreparationService
from utils.types import TextQueryResult


class ImageProductPipeline:
    def __init__(self, cnn_service: CNNModelService, data_service: DataPreparationService):
        self.cnn_service = cnn_service
        self.data_service = data_service

    def run(self, image_path: Optional[str]) -> TextQueryResult:
        prediction = self.cnn_service.predict_product(image_path)
        if prediction is None:
            return {
                "products": [],
                "response": "could not identify product",
                "predicted_class": "Unknown",
                "confidence": 0.0,
            }

        predicted_class = prediction["predicted_class"]
        confidence = float(prediction["confidence"]) if "confidence" in prediction else 0.0

        products = self.data_service.search_products(predicted_class, top_k=5)

        base = (
            f"identified '{predicted_class}' {confidence:.1%}"
            if confidence > 0.7
            else f"tentative '{predicted_class}' {confidence:.1%}"
        )

        return {
            "products": products,
            "response": base + (" similar items" if products else " no similar items"),
            "predicted_class": predicted_class,
            "confidence": round(confidence, 3),
        }

