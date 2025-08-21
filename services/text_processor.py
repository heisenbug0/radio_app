import json
import os
import re
from typing import List, Set


class TextProcessor:
    """small text cleaner with configurable stopwords + sensitive patterns"""
    def __init__(self, stopwords: Set[str] | None = None, sensitive_patterns: List[str] | None = None) -> None:
        self.stopwords = stopwords or self._load_stopwords()
        self.sensitive_patterns = sensitive_patterns or self._load_sensitive_patterns()
        self._sensitive_regex = re.compile("|".join(self.sensitive_patterns), re.IGNORECASE) if self.sensitive_patterns else None

    def _load_stopwords(self) -> Set[str]:
        # env override: TEXT_STOPWORDS_JSON='["the","and"]' or path in TEXT_STOPWORDS_PATH
        try:
            path = os.getenv("TEXT_STOPWORDS_PATH")
            if path and os.path.exists(path):
                with open(path, "r") as f:
                    data = json.load(f)
                return {w.strip().lower() for w in data if isinstance(w, str)}
            raw = os.getenv("TEXT_STOPWORDS_JSON")
            if raw:
                data = json.loads(raw)
                return {w.strip().lower() for w in data if isinstance(w, str)}
        except Exception:
            pass
        # default minimal set
        return {
            "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
            "is","are","was","were","be","been","have","has","had","do","does","did","will",
            "would","could","should","may","might","can","this","that","these","those","i","you",
            "he","she","it","we","they","me","him","her","us","them","my","your","his","its",
            "our","their",
        }

    def _load_sensitive_patterns(self) -> List[str]:
        # env override: TEXT_SENSITIVE_REGEX='["\\bpassword\\b","\\bssn\\b"]' or file TEXT_SENSITIVE_PATH
        try:
            path = os.getenv("TEXT_SENSITIVE_PATH")
            if path and os.path.exists(path):
                with open(path, "r") as f:
                    data = json.load(f)
                return [str(p) for p in data]
            raw = os.getenv("TEXT_SENSITIVE_REGEX")
            if raw:
                data = json.loads(raw)
                return [str(p) for p in data]
        except Exception:
            pass
        return [r"\b(password|secret|private|confidential)\b", r"\b(admin|root|sudo)\b", r"\b(credit\s*card|ssn|social\s*security)\b"]

    def is_sensitive(self, text: str) -> bool:
        if not text:
            return False
        if not self._sensitive_regex:
            return False
        return bool(self._sensitive_regex.search(text))

    def simplify(self, text: str) -> str:
        if not text:
            return ""
        words = [w for w in text.lower().split() if w not in self.stopwords and len(w) > 2]
        return " ".join(words) if words else text