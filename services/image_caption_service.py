import base64
import os
from typing import Dict

import requests


class ImageCaptionService:
    def __init__(self):
        self.hf_token = os.getenv("HUGGINGFACE_API_TOKEN") or os.getenv("HF_API_TOKEN")
        # default caption model
        self.model_id = os.getenv("HF_IMAGE_CAPTION_MODEL", "Salesforce/blip-image-captioning-base")
        self.timeout = float(os.getenv("HF_TIMEOUT", "60"))

    def _headers(self) -> Dict[str, str]:
        headers = {"Accept": "application/json"}
        if self.hf_token:
            headers["Authorization"] = f"Bearer {self.hf_token}"
        return headers

    def caption(self, image_path: str) -> Dict[str, str]:
        try:
            with open(image_path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("utf-8")
            mime = "image/jpeg"
            if image_path.lower().endswith(".png"):
                mime = "image/png"
            data_url = f"data:{mime};base64,{b64}"
        except Exception as e:
            return {"success": False, "error": f"read_error: {e}", "caption": ""}

        url = "https://api-inference.huggingface.co/pipeline/image-to-text"
        payload = {"model": self.model_id, "inputs": data_url, "parameters": {"max_new_tokens": 32}, "options": {"wait_for_model": True}}
        try:
            r = requests.post(url, headers=self._headers(), json=payload, timeout=self.timeout)
            if r.status_code >= 400:
                url2 = f"https://api-inference.huggingface.co/models/{self.model_id}"
                payload2 = {"inputs": data_url, "parameters": {"max_new_tokens": 32}, "options": {"wait_for_model": True}}
                r = requests.post(url2, headers=self._headers(), json=payload2, timeout=self.timeout)
            r.raise_for_status()
            data = r.json()
            text = ""
            if isinstance(data, list) and data:
                item = data[0]
                text = item.get("generated_text") or item.get("caption") or ""
            elif isinstance(data, dict):
                text = data.get("generated_text") or data.get("caption") or ""
            text = (text or "").strip()
            return {"success": True, "caption": text}
        except Exception as e:
            try:
                print(f"[CAPTION_ERR] {e}")
            except Exception:
                pass
            return {"success": False, "error": f"api_error: {e}", "caption": ""}