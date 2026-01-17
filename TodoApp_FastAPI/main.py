from fastapi import FastAPI
# from typing import Annotated
from .models import Base
from .routers import auth, todos, admin, users
from .database import engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get('/healthy')
def health_status():
    return {'Status':'Healthy'}

app.include_router(auth.router) 
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(users.router)

