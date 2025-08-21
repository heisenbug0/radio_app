import os


def unique_filename(download_dir: str, stock_code: str, index: int, ext: str, content_hash: str) -> tuple[str, str]:
	"""stable, collision-free filename for a product image"""
	short = content_hash[:10]
	safe_code = "".join(c for c in str(stock_code) if c.isalnum() or c in ("-", "_")).strip() or "prod"
	base = f"{safe_code}_{index}_{short}"
	filename = f"{base}.{ext}"
	path = os.path.join(download_dir, filename)
	i = 1
	while os.path.exists(path):
		filename = f"{base}_{i}.{ext}"
		path = os.path.join(download_dir, filename)
		i += 1
	return filename, path

