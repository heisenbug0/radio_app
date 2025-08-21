import re
import pandas as pd


def clean_product_name(product_name: str | None) -> str | None:
	if not product_name or (isinstance(product_name, float) and pd.isna(product_name)):
		return None
	name = str(product_name).strip()
	prefixes = ["SET OF ", "SET ", "PACK OF ", "PACK ", "BOX OF ", "BOX ", "LARGE ", "SMALL ", "MINI ", "$", "£", "€", "¥"]
	for p in prefixes:
		if name.upper().startswith(p):
			name = name[len(p):].strip()
	name = re.sub(r"[^\w\s]", " ", name)
	name = re.sub(r"\s+", " ", name).strip()
	words = [w for w in name.split() if len(w) > 2 and not w.isdigit()]
	if not words:
		return name[:50]
	return " ".join(words[:4])


def search_variations(clean_name: str, max_images: int) -> list[str]:
	variations = [clean_name, f"{clean_name} product", f"{clean_name} photo", f"{clean_name} item", f"{clean_name} retail"]
	if max_images <= 5:
		return variations[:3]
	return variations

