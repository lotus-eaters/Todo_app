from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from typing import Annotated
from .models import Base
from .routers import auth, todos, admin, users
from .database import engine
from .config import ALLOWED_ORIGINS

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get('/healthy')
def health_status():
    return {'Status':'Healthy'}

app.include_router(auth.router) 
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(users.router)

