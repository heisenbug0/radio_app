# Afrimeet API (FastAPI)

A lightweight backend for mobile clients.

## Endpoints
- GET /health
- GET /v1/config → { stream_api_key }
- GET /v1/stream/token → { token } (requires Authorization: Bearer <Clerk JWT>)

## Env
- `ALLOWED_ORIGINS` (CSV) e.g. https://your-web,exp://127.0.0.1:8081
- `WEB_BASE_URL` e.g. https://your-web
- `NEXT_PUBLIC_STREAM_API_KEY`
- `CLERK_ISSUER` (e.g. https://<your-subdomain>.clerk.accounts.dev)
- `CLERK_JWKS_URL` (e.g. https://<your-subdomain>.clerk.accounts.dev/.well-known/jwks.json)

## Run
```
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Notes
- Token endpoint currently proxies to the Next.js route. You can move token minting fully into Python if desired once the Stream video token spec is confirmed.