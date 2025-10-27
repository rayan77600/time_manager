# security.py
from typing import Dict, Any, Optional
from fastapi import HTTPException, Request
from jose import jwt
import httpx, time
from app.settings import settings
from fastapi import Request

async def get_current_user_from_cookie(req: Request):
    token = req.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing cookie token")
    return await verify_jwt(token)

_JWKS: Optional[Dict[str, Any]] = None
_JWKS_EXP = 0
_JWKS_TTL = 600  # 10 minutes de cache

async def _get_jwks() -> Dict[str, Any]:
    global _JWKS, _JWKS_EXP
    now = time.time()
    if _JWKS and now < _JWKS_EXP:
        return _JWKS
    async with httpx.AsyncClient(timeout=5) as client:
        r = await client.get(settings.jwks_url)
        r.raise_for_status()
        _JWKS = r.json()
        _JWKS_EXP = now + _JWKS_TTL
        return _JWKS

async def verify_jwt(token: str) -> Dict[str, Any]:
    # 1) récupérer le kid depuis l'en-tête JWT
    try:
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token header")
    if not kid:
        raise HTTPException(status_code=401, detail="Missing 'kid' in header")

    # 2) trouver la clé publique correspondante dans la JWKS
    jwks = await _get_jwks()
    key = next((k for k in jwks.get("keys", []) if k.get("kid") == kid), None)
    if not key:
        raise HTTPException(status_code=401, detail="Signing key not found")

    # 3) vérifier signature + issuer + audience + dates (exp/iat/nbf)
    try:
        claims = jwt.decode(
            token,
            key,
            algorithms=settings.algorithms,
            audience=settings.audience,
            issuer=settings.issuer,
        )
        return claims
    except Exception as ex:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {ex}")

async def get_current_user(req: Request) -> Dict[str, Any]:
    # Token attendu dans l'en-tête Authorization: Bearer <token>
    auth = req.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = auth.split(" ", 1)[1].strip()
    return await verify_jwt(token)
