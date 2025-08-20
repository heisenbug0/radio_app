from typing import List
from services.data_preparation import DataPreparationService
from utils.types import ScoredProduct, TextQueryResult
import re


class TextQueryPipeline:
    def __init__(self, data_service: DataPreparationService):
        self.data_service = data_service

    def _is_sensitive(self, text: str) -> bool:
        patterns = [
            r"\b(password|secret|private|confidential)\b",
            r"\b(admin|root|sudo)\b",
            r"\b(credit\s*card|ssn|social\s*security)\b",
        ]
        for p in patterns:
            if re.search(p, text, re.IGNORECASE):
                return True
        return False

    def run(self, query: str, top_k: int = 5) -> TextQueryResult:
        if not query or len(query.strip()) < 2:
            return {
                "products": [],
                "response": "please add a short query (>= 2 chars)",
            }

        if self._is_sensitive(query):
            return {
                "products": [],
                "response": "can't process sensitive info",
            }

        products: List[ScoredProduct] = self.data_service.search_products(query, top_k=top_k)

        if not products:
            return {
                "products": [],
                "response": f"no match for '{query}'. try different words",
            }

        return {
            "products": products,
            "response": f"found {len(products)} for '{query}'",
        }

