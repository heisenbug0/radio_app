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


def preprocess_handwriting_image(pil_image):
    """light cv2 preprocessing to help handwritten text: upscale, denoise, binarize"""
    try:
        import numpy as np
        import cv2
        from PIL import Image
    except Exception:
        return pil_image
    try:
        img = np.array(pil_image.convert('RGB'))
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        # upscale a bit to help recognition
        h, w = gray.shape
        scale = 2 if max(h, w) < 1200 else 1
        if scale != 1:
            gray = cv2.resize(gray, (w*scale, h*scale), interpolation=cv2.INTER_CUBIC)
        # denoise + contrast
        gray = cv2.bilateralFilter(gray, 7, 50, 50)
        gray = cv2.equalizeHist(gray)
        # adaptive threshold
        th = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 10)
        # slight dilation to connect strokes
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        th = cv2.morphologyEx(th, cv2.MORPH_CLOSE, kernel, iterations=1)
        # convert back
        bin_rgb = cv2.cvtColor(th, cv2.COLOR_GRAY2RGB)
        return Image.fromarray(bin_rgb)
    except Exception:
        return pil_image

