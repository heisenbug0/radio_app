## project

small product search app. text, ocr text, product image -> simple recs. flask api + tiny ui.

## structure

- `app.py` entry
- `services/` core services (data, ocr, cnn, optional multimodal)
- `pipelines/` thin orchestration for text + ocr
- `utils/` typed dicts
- `templates/` minimal pages
- `data/` csv + assets
- `notebooks/` quick experiments

## setup

- python 3.11+
- put your csv at `data/dataset.csv`
- optional env: `.env` with pinecone keys

```bash
pip install -r requirements.txt
# if you want local embeddings + multimodal
pip install 'sentence-transformers>=3,<4' torch torchvision
python app.py
```

open `http://localhost:5000`

## endpoints

- post `/product-recommendation` form `query`
- post `/ocr-query` file `image_data`
- post `/image-product-search` file `product_image`

## how it works (short)

- `services/data_preparation.py` reads csv, cleans, builds embeddings, searches (cosine)
- `services/ocr_service.py` picks google/easyocr if available
- `services/cnn_model.py` optional training / zero‑shot helpers
- `services/local_multimodal_search.py` clip text/image search (cpu ok)
- `pipelines/*` keep flows small and reusable

## optional bits

- pinecone: set `PINECONE_API_KEY`, else stays local
- google vision: set `GOOGLE_APPLICATION_CREDENTIALS` path
- easyocr: `pip install easyocr`

## notebooks

- `01_data_explore.ipynb` quick skim of csv
- `02_vector_search_eval.ipynb` text search sanity
- `03_cnn_training.ipynb` small run
- `04_inference_demos.ipynb` text/ocr/image flows

## notes

- defaults try to be safe. if something heavy is missing, it degrades gracefully
- short docstrings + type hints added to main services and pipelines

