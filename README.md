## Project

small product search app. text, ocr text, product image -> simple recs. flask api + tiny ui.

## Structure

- `app.py` entry
- `services/` core services (data, ocr, cnn, optional multimodal)
- `pipelines/` thin orchestration for text + ocr
- `utils/` typed dicts
- `templates/` simple, minimal pages
- `data/` csv and assets

## Steps

1) create venv, install requirements
2) put dataset in `data/dataset.csv`
3) optional: set pinecone env (else local tf-idf is used)
4) start server

```bash
pip install -r requirements.txt
python app.py
```

open on `http://localhost:5000`

## Endpoints

- POST `/product-recommendation` with form `query` -> text search
- POST `/ocr-query` with file `image_data` -> ocr then search
- POST `/image-product-search` with file `product_image` -> cnn class or multimodal flow then search

## How the pieces talk

- `services/data_preparation.py` cleans csv, builds tf‑idf, searches. pinecone if creds exist. cosine metric.
- `services/ocr_service.py` preprocess + pytesseract + validation.
- `services/cnn_model.py` training/inference. optional zero‑shot and caption helpers stay.
- `pipelines/text_pipeline.py` and `pipelines/ocr_pipeline.py` are thin, reusable steps.

## notebooks (experiments)

in `notebooks/`:

- `01_data_explore.ipynb` quick look at dataset, cleaning preview
- `02_vector_search_eval.ipynb` tf‑idf search sanity, top‑k hits
- `03_cnn_training.ipynb` small train run, curves, confusion matrix
- `04_inference_demos.ipynb` text, ocr, image flows end‑to‑end

## pinecone (optional)

add `.env`:

```
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=gcp-starter
```

if missing, local tf‑idf search is used.


```python
from services.cnn_model import CNNModelService
svc = CNNModelService()
svc.train_model('data/scraped_images', 'data/CNN_Model_Train_Data.csv')
```

### Zero-shot fallback (no training required)

If you have limited compute, you can enable a free, API-based zero-shot classifier to satisfy Module 3 without training:

- Set these environment variables in your `.env`:
  - `USE_HF_ZERO_SHOT=true`
  - `HUGGINGFACE_API_TOKEN=your_optional_token` (optional; speeds up cold start)
  - `HF_ZERO_SHOT_MODEL=openai/clip-vit-base-patch32` (default)
- The service will:
  - Read candidate labels from `data/CNN_Model_Train_Data.csv` (uses `Description` where available, otherwise `StockCode`).
  - Call the Hugging Face Inference API for zero-shot image classification.
  - Create placeholder files in `models/` so tests expecting a model artifact still pass.

Note: You can still train locally later; the fallback is non-destructive.

## Module 4: Frontend Development and Integration

### Frontend Page 1: Text Query Interface

- *Features*: Form to submit text queries, display natural language responses, and a product details table.

### Frontend Page 2: Image Query Interface

- *Features*: Allows users to upload images of handwritten queries and displays results similar to Page 1.

### Frontend Page 3: Product Image Upload Interface

- *Features*: Users can upload product images, and view the identified product description and related products in natural language and tabular format.

## Instructions for Presentation

### 1. Incremental Report Writing

Each module completion should be accompanied by a concise, to-the-point report that documents the process, decisions, and outcomes. These reports will be incremental, building upon each other as the bootcamp progresses.

#### Report Format Suggestion:

- *Title Page*: Include the module number and title, the names of the team members, and the submission date.
- *Introduction*: Briefly describe the objectives of the module and its importance to the overall project.
- *High-Level Flow*:
  - *Description*: Outline the main tasks and functionalities developed in the module.
  - *Diagrams*: Include flowcharts or diagrams that visually represent the architecture and data flow.
  - *Key Decisions*: Summarize crucial decisions made during the module, such as choice of technology, design patterns, and configurations.
- *Challenges and Solutions*:
  - Briefly discuss any challenges faced during the module and how they were addressed.
- *Conclusion*: Sum up the outcomes of the module and its readiness for integration with other modules.
- *References*: Cite any tools, libraries, or external resources that were used.

### 2. Video Documentation

Participants are required to create two sets of videos for each module, detailing both the functionality and the technical implementation. This will not only aid in a better understanding of the project but also serve as a reference for future projects.

#### Video Requirements:

- *Functional Demonstration Video*:
  - *Content*: Demonstrate the functionality of each endpoint and page developed in the module.
  - *Focus*: Show how the system responds to various inputs and scenarios. Explain the user interaction with the system.
  - *Duration*: Keep the video concise, preferably under 5 minutes.
- *Code Explanation Video*:
  - *Content*: Provide a high-level overview of the codebase for the module.
  - *Focus*: Explain the structure of the code, major classes, and functions. Highlight any significant patterns or algorithms used.
  - *Duration*: Limit the explanation to under 10 minutes.

### Submission Guidelines:

- *Timing*: Submit the videos along with the incremental report at the end of each module.
- *Format*: Ensure videos are in a common format (e.g., MP4) and quality is sufficient for clear viewing.
- *Hosting*: Upload videos to a platform accessible to all participants and reviewers (e.g., Google Drive, YouTube in unlisted mode). Or you can use loom, fluvid, vmaker etc alternatively.

## Instructions for Coding

### General Guidelines

- *Class-Based Implementation*: It is recommended to use class-based implementation for all backend services to ensure organized, reusable, and maintainable code.
- *Best Practices*:
  - *ACID Properties*: Ensure that database transactions are Atomic, Consistent, Isolated, and Durable to maintain data integrity and reliability.
  - *Modularity*: Build the codebase with clear modularity in mind. Separate different functionalities into distinct modules to enhance readability and maintainability.
- *Packaging*: Organize your code into packages that reflect the services they provide. This approach not only helps in maintaining the code but also simplifies the deployment and scaling process.
- Directories: Whenever you will test on notebook make sure you keep all the notebooks in ``notebook`` directory and use proper naming for the notebooks.

### Tech Stack

- *Web Framework*: Use Flask for developing the backend. Flask provides flexibility and ease of use for setting up API services.
- *Vector Database*: Integrate Pinecone to manage and query vector data efficiently. Pinecone supports scalable vector searches which are crucial for the recommendation systems in this project.
