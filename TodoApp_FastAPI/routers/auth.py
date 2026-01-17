from fastapi import FastAPI,APIRouter,Depends,HTTPException
from pydantic import BaseModel
from ..models import Users
from datetime import timedelta, datetime,timezone
from starlette import status
from passlib.context import CryptContext
from ..database import SessionLocal
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt,JWTError

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = '0d1cbf3f7e351a7b99f75cdd2b7617dda3ca555c6a5144a84aa2ec021d6726e3'
ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'],deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

class CreateUserRequest(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    password: str
    role: str
    phone_number: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

def authenticate_user(username:str, password:str, db):
    user = db.query(Users).filter(Users.username==username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(username: str, userid: str, user_role:str, expires_delta=timedelta):
    encode = {'sub':username,'id':userid, 'role':user_role}
    expires = datetime.now(timezone.utc) + expires_delta  # FIXED!
    encode.update({'exp':expires})
    return jwt.encode(encode,SECRET_KEY,ALGORITHM)

def get_current_user(token: str = Depends(oauth2_bearer)):
    try:
        payload=jwt.decode(token,SECRET_KEY,ALGORITHM)
        username: str=payload.get('sub')
        user_id: int=payload.get('id')
        user_role: str=payload.get('role')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                    detail='Could not validate user.')
        return {'username': username, 'id': user_id, 'user_role': user_role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')


@router.post('/',status_code=status.HTTP_201_CREATED)
def create_user(create_user_request:CreateUserRequest, db: Session=Depends(get_db)):
    create_user_model = Users(
        email=create_user_request.email,
        username=create_user_request.username,
        first_name=create_user_request.first_name,
        last_name=create_user_request.last_name,
        role=create_user_request.role,
        hashed_password=bcrypt_context.hash(create_user_request.password),
        is_active=True,
        phone_number=create_user_request.phone_number
    )
    db.add(create_user_model)
    db.commit()
    
@router.post('/token', response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(OAuth2PasswordRequestForm), db: Session=Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        return 'Authentication Failed'
    token = create_access_token(user.username, user.id, user.role, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}
    
