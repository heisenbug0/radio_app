## what this is

small product search app. text, ocr text, product image -> simple recs. flask api + tiny ui.

## structure

- `app.py` entry
- `services/` core services (data, ocr, cnn)
- `pipelines/` thin orchestration for text, ocr, image
- `ml/` cnn parts split: `modeling/`, `data/`, `training/`
- `utils/` typed dicts
- `templates/` simple pages
- `data/` csv and assets

## run

1) create venv, install requirements
2) put dataset in `data/dataset.csv`
3) optional: set pinecone env (else local tf-idf is used)
4) start server

```bash
pip install -r requirements.txt
export FLASK_APP=app.py
python app.py
```

open `http://localhost:5000`

## endpoints

- POST `/product-recommendation` with form `query` -> text search
- POST `/ocr-query` with file `image_data` -> ocr then search
- POST `/image-product-search` with file `product_image` -> cnn class then search

json shape is simple. see `templates/sample_response.html` or try it.

## how the pieces talk

- `services/data_preparation.py` cleans csv, builds tf‑idf, searches. pinecone if creds exist. cosine metric.
- `services/ocr_service.py` preprocess + pytesseract + quick validation.
- `services/cnn_model.py` orchestrates cnn train/load/predict. uses `ml/` modules.
- `pipelines/*.py` stitch small steps per use case. very thin. keeps concerns apart.

## notebooks (experiments)

in `notebooks/` you’ll find:

- `01_data_explore.ipynb` quick look at dataset, cleaning preview
- `02_vector_search_eval.ipynb` tf‑idf search sanity, top‑k hits
- `03_cnn_training.ipynb` small train run, curves, confusion matrix
- `04_inference_demos.ipynb` text, ocr, image flows end‑to‑end

this is what people mean by experimental notebooks: throwaway, small experiments to try ideas, visualize, and record results before baking into code. they don’t ship to prod. you run them locally to test assumptions.

## dev notes

- small files, short funcs, clear names.
- typed dicts in `utils/types.py`.
- minimal docstrings, lowercase tone.
- errors are handled and never crash the api.

## setup pinecone (optional)

add a `.env` with:

```
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=gcp-starter
```

if missing, local tf‑idf search is used.

## train the cnn (optional)

prepare images in `data/scraped_images/` like `STOCKCODE_1.jpg` etc. products list by `StockCode` in csv.

```python
from services.cnn_model import CNNModelService
svc = CNNModelService()
svc.train_model('data/scraped_images', 'data/CNN_Model_Train_Data.csv')
```

it saves into `models/` and api uses it for `/image-product-search`.

## license

mit
