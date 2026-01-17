from fastapi import APIRouter,Depends,HTTPException,Path
from pydantic import BaseModel,Field
# from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from ..models import Users
from ..database import SessionLocal
from .auth import get_current_user
from passlib.context import CryptContext
 
router = APIRouter(    
    prefix='/user',
    tags=['user']
)

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

class UserVerification(BaseModel):
    password: str
    new_password: str = Field(min_length=6)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
async def get_user(user: dict=Depends(get_current_user),db: Session=Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401,detail='Authentication failed')
    return db.query(Users).filter(Users.id==user.get('id')).first()

@router.put("/password",status_code=status.HTTP_204_NO_CONTENT)
async def change_password(user_verfication:UserVerification,user: dict=Depends(get_current_user),db: Session=Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401,detail='Authentication failed') 
    user_model = db.query(Users).filter(Users.id == user.get('id')).first()
    if not bcrypt_context.verify(user_verfication.password, user_model.hashed_password):
        raise HTTPException(status_code=401, detail='Error on password change')
    user_model.hashed_password = bcrypt_context.hash(user_verfication.new_password)
    db.add(user_model)
    db.commit()

@router.put("/phonenumber/{phone_number}", status_code=status.HTTP_204_NO_CONTENT)
async def change_phonenumber(phone_number: str,user: dict=Depends(get_current_user),db: Session=Depends(get_db)):
    if user is None:
        raise HTTPException(status_code=401,detail='Authentication failed')
    user_model = db.query(Users).filter(Users.id == user.get('id')).first()
    user_model.phone_number = phone_number
    db.add(user_model)
    db.commit()

