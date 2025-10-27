from fastapi import FastAPI, Depends
from app.security import get_current_user           
from sqlmodel import SQLModel                   
from app.routers import users, clocks, teams
from app.database import engine
from fastapi import Response, Body
from app.security import verify_jwt
from fastapi import Depends
from app.security import get_current_user, get_current_user_from_cookie

app = FastAPI(
	title="Time Manager API",
	description="API for managing users in a PostgreSQL database using FastAPI and SQLModel.",
	version="1.0.0",
	# root_path="/api", Add in production
	redirect_slashes=False
)

from fastapi.middleware.cors import CORSMiddleware

# 🔹 Autoriser le front (React) à communiquer avec le back
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
	SQLModel.metadata.create_all(engine)

@app.get("/")
async def root():
	return {"message": "Connected to the PostgreSQL DB via SQLModel!"}

@app.post("/auth/session")
async def create_session(response: Response, token: str = Body(..., embed=True)):
    """
    🔐 Reçoit le token Keycloak du frontend et crée un cookie de session.
    """
    # Vérifie que le token est bien valide
    await verify_jwt(token)

    # Crée le cookie de session (valide pour 1h)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  
        samesite="Lax",
        max_age=3600,
    )
    return {"message": "Session créée avec succès"}

auth_dep = Depends(get_current_user_from_cookie)

app.include_router(users.router, dependencies=[auth_dep])
app.include_router(clocks.router, dependencies=[auth_dep])
app.include_router(teams.router, dependencies=[auth_dep])