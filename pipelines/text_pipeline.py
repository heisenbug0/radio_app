import re
from typing import List

from services.data_preparation import DataPreparationService
from services.text_processor import TextProcessor
from utils.types import ScoredProduct, TextQueryResult


class TextQueryPipeline:
    """text -> product search (thin flow)"""
    def __init__(self, data_service: DataPreparationService) -> None:
        self.data_service = data_service
        self.text = TextProcessor()

    def _is_sensitive(self, text: str) -> bool:
        return self.text.is_sensitive(text)

    def _simplify(self, text: str) -> str:
        return self.text.simplify(text)

    def run(self, query: str, top_k: int = 5) -> TextQueryResult:
        """sanitize, search, return top k"""
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

