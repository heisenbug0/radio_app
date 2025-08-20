from typing import TypedDict, List, Optional


class Product(TypedDict):
    stock_code: str
    description: str
    unit_price: float
    quantity: int


class ScoredProduct(Product):
    similarity_score: float


class TextQueryResult(TypedDict, total=False):
    products: List[ScoredProduct]
    response: str
    extracted_text: Optional[str]
    predicted_class: Optional[str]
    confidence: Optional[float]
