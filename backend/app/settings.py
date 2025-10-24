from pydantic import BaseModel

class Settings(BaseModel):
    issuer: str = "http://localhost:4000/auth/realms/time-manager"
    jwks_url: str = "http://localhost:4000/auth/realms/time-manager/protocol/openid-connect/certs"
    audience: str = "api"   # ex: "my-api"
    algorithms: list[str] = ["RS256"]

settings = Settings()