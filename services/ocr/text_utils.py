import re


def clean_extracted_text(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"\s+", " ", text.strip())
    cleaned = re.sub(r"[^\w\s\-.,!?]", "", cleaned)
    cleaned = cleaned.lower()
    corrections = {"0": "o", "1": "l", "5": "s", "8": "b", "rn": "m", "cl": "d"}
    for wrong, correct in corrections.items():
        cleaned = cleaned.replace(wrong, correct)
    return cleaned


def validate_query(text: str) -> tuple[bool, str]:
    if not text or len(text.strip()) < 2:
        return False, "Query too short"
    if len(text) > 500:
        return False, "Query too long"
    readable_chars = sum(1 for c in text if c.isalnum() or c.isspace())
    if len(text) == 0 or (readable_chars / max(1, len(text))) < 0.3:
        return False, "Query contains too many non-readable characters"
    return True, "Valid query"

