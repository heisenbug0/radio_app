import re
from typing import List

from services.data_preparation import DataPreparationService
from utils.types import ScoredProduct, TextQueryResult


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

    def _simplify(self, text: str) -> str:
        stop = {
            "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
            "is","are","was","were","be","been","have","has","had","do","does","did","will",
            "would","could","should","may","might","can","this","that","these","those","i","you",
            "he","she","it","we","they","me","him","her","us","them","my","your","his","its",
            "our","their",
        }
        words = [w for w in text.lower().split() if w not in stop and len(w) > 2]
        return " ".join(words) if words else text

    def run(self, query: str, top_k: int = 5) -> TextQueryResult:
        if not query or len(query.strip()) < 2:
            return {"products": [], "response": "please add a short query (>= 2 chars)"}

        if self._is_sensitive(query):
            return {"products": [], "response": "can't process sensitive info"}

        products: List[ScoredProduct] = self.data_service.search_products(query, top_k=top_k)
        if not products:
            simpler = self._simplify(query)
            if simpler != query:
                products = self.data_service.search_products(simpler, top_k=top_k)

        if not products:
            return {"products": [], "response": "no products found"}

        return {"products": products, "response": "results:"}

