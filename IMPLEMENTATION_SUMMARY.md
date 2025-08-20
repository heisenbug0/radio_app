## implementation summary (short)

### modules

- `services/` core capabilities
- `pipelines/` small flows (text, ocr, image)
- `ml/` cnn internals (modeling/data/training)
- `utils/` shared typed dicts
- `templates/` small ui pages

### why this split

- clear separation of concerns
- fewer lines per file, easier to scan
- reuse parts across flows
- simpler errors

### ops

- pinecone optional, local tf‑idf fallback
- models saved to `models/`
- experiments live in `notebooks/`

### start

```bash
python app.py
```