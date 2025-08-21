import re
import unicodedata
import pandas as pd


def normalize_ascii(text: str) -> str:
	text = unicodedata.normalize('NFKD', text)
	return text.encode('ascii', 'ignore').decode('ascii')


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
	# normalize
	df['StockCode'] = df['StockCode'].astype(str).map(normalize_ascii).str.strip()
	df['StockCode'] = df['StockCode'].apply(lambda x: re.sub(r'[^A-Za-z0-9_-]', '', x))
	df['Description'] = df['Description'].astype(str).map(normalize_ascii).str.strip()
	df['Description'] = df['Description'].apply(lambda x: re.sub(r'[^A-Za-z0-9\s-]', ' ', x))
	df['Description'] = df['Description'].apply(lambda x: re.sub(r'\s+', ' ', x).strip())
	# uppercase for matching
	df['Description'] = df['Description'].str.upper()
	# drop noise
	noise_patterns_exact = [r'^UNKNOWN$', r'^UNKWN$', r'^NA$', r'^N/A$', r'^POSTAGE$', r'^CARRIAGE$', r'^SAMPLE$', r'^DAMAGED$', r'^BROKEN$']
	noise_regex_exact = re.compile('|'.join(noise_patterns_exact))
	df = df[~df['Description'].fillna('').apply(lambda t: bool(noise_regex_exact.search(t)) or ('MISSING' in t) or ('MIXED UP' in t))]
	# keep useful
	df = df[df['Description'].str.contains(r'[A-Z]', regex=True, na=False)]
	df = df[df['Description'].str.len() >= 3]
	# numeric and positive
	df['UnitPrice'] = pd.to_numeric(df['UnitPrice'], errors='coerce')
	df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce')
	df = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]
	# drop empty stock codes
	df = df[df['StockCode'].str.len() > 0]
	return df

