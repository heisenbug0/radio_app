from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import httpx
from jose import jwt
from jose.utils import base64url_decode
from functools import lru_cache

app = FastAPI(title="Afrimeet API", version="1.0.0")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
WEB_BASE_URL = os.getenv("WEB_BASE_URL", "")
STREAM_API_KEY = os.getenv("NEXT_PUBLIC_STREAM_API_KEY", "")
CLERK_ISSUER = os.getenv("CLERK_ISSUER", "")
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class TokenResponse(BaseModel):
    token: str

class ConfigResponse(BaseModel):
    stream_api_key: str

@lru_cache(maxsize=1)
def _fetch_jwks():
    if not CLERK_JWKS_URL:
        return None
    with httpx.Client(timeout=5.0) as client:
        resp = client.get(CLERK_JWKS_URL)
        resp.raise_for_status()
        return resp.json()

async def verify_clerk_token(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ", 1)[1]
    if not CLERK_ISSUER or not CLERK_JWKS_URL:
        raise HTTPException(status_code=500, detail="Server misconfiguration")
    jwks = _fetch_jwks()
    try:
        claims = jwt.get_unverified_claims(token)
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
        key = None
        for jwk in jwks.get("keys", []):
            if jwk.get("kid") == kid:
                key = jwk
                break
        if not key:
            raise HTTPException(status_code=401, detail="Invalid token kid")
        # jose handles verification with jwk dict directly
        decoded = jwt.decode(token, key, algorithms=[headers.get("alg")], audience=claims.get("aud"), issuer=CLERK_ISSUER)
        user_id = decoded.get("sub") or decoded.get("sid") or decoded.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/v1/config", response_model=ConfigResponse)
async def get_config():
    if not STREAM_API_KEY:
        raise HTTPException(status_code=500, detail="Missing STREAM API key")
    return {"stream_api_key": STREAM_API_KEY}

@app.get("/v1/stream/token", response_model=TokenResponse)
async def get_stream_token(user_id: str = Depends(verify_clerk_token)):
    if not WEB_BASE_URL:
        raise HTTPException(status_code=500, detail="Missing WEB_BASE_URL")
    # Proxy to Next.js secure token endpoint; it uses Clerk session from the bearer token
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            # forward the same Authorization header; Next.js Clerk middleware should validate it
            resp = await client.get(f"{WEB_BASE_URL}/api/stream/token", headers={"Authorization": f"Bearer {user_id}"})
            # Note: If your Next server expects cookies/session, adjust this to exchange the token appropriately.
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Upstream token fetch failed")
            data = resp.json()
            token = data.get("token")
            if not token:
                raise HTTPException(status_code=500, detail="Invalid upstream response")
            return {"token": token}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch token")