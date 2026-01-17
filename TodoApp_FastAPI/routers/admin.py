from fastapi import APIRouter,Depends,HTTPException,Path
from pydantic import BaseModel,Field
# from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from ..models import Todos
from ..database import SessionLocal
from .auth import get_current_user

router = APIRouter(
    prefix='/admin',
    tags=['admin']
)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/todo', status_code=status.HTTP_200_OK)
def read_all(db: Session=Depends(get_db), user: dict=Depends(get_current_user)):
    if user is None or user.get('user_role')!='admin':
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return db.query(Todos).all()


@router.delete('/todo/{todo_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int = Path(gt=0), 
                db: Session = Depends(get_db), 
                user: dict = Depends(get_current_user)):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code=401, detail='Authentication failed')
    
    todo_model = db.query(Todos).filter(Todos.id == todo_id).first()  # ← FIXED
    if todo_model is None:
        raise HTTPException(status_code=404, detail='Todo not found.')
    
    db.query(Todos).filter(Todos.id == todo_id).delete()
    db.commit()
    

