from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src import models, schemas, crud, database
from src.database import engine, SessionLocal
from passlib.context import CryptContext
from src.auth import authenticate_user, create_access_token, get_current_user
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

DEV_MODE = os.getenv("DEV_MODE") == "True"

models.Base.metadata.create_all(bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_data():
    db = SessionLocal()
    admin_user = db.query(models.User).filter(models.User.username == "admin").first()
    demo_user = db.query(models.User).filter(models.User.username == "demo").first()
    dev_user = db.query(models.User).filter(models.User.username == "dev_user").first()

    if not admin_user:
        admin_user = models.User(
            username="admin",
            password=pwd_context.hash("music sounds better with you"),
            first_name="Admin",
            last_name="User",
            email="admin@example.com"
        )
        db.add(admin_user)

    if not demo_user:
        demo_user = models.User(
            username="demo",
            password=pwd_context.hash("hello world"),
            first_name="Demo",
            last_name="User",
            email="demo@example.com"
        )
        db.add(demo_user)
    
    if not dev_user:
        dev_user = models.User(
            username="dev_user",
            password=pwd_context.hash("dev_password"),
            first_name="Dev",
            last_name="User",
            email="dev@example.com"
        )
        db.add(dev_user)

    db.commit()
    db.close()

seed_data()

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    if DEV_MODE:
        user = db.query(models.User).filter(models.User.username == "dev_user").first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Dev user not found",
            )
    else:
        user = authenticate_user(db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# Post new suggestions
@app.post("/suggestions/", response_model=schemas.Suggestion, dependencies=[Depends(oauth2_scheme)])
def create_suggestion(suggestion: schemas.SuggestionCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    return crud.create_suggestion(db=db, suggestion=suggestion, user_id=current_user.id)

# Edit existing suggestions
@app.put("/suggestions/{suggestion_id}", response_model=schemas.Suggestion, dependencies=[Depends(oauth2_scheme)])
def update_suggestion(suggestion_id: int, suggestion: schemas.SuggestionUpdate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    db_suggestion = crud.get_suggestion(db, suggestion_id=suggestion_id)
    if not db_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    if db_suggestion.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this suggestion")
    updated_suggestion = crud.update_suggestion(db, suggestion_id=suggestion_id, suggestion_update=suggestion)
    if not updated_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return updated_suggestion

# Get all suggestions
@app.get("/suggestions/", response_model=List[schemas.Suggestion], dependencies=[Depends(oauth2_scheme)])
def read_suggestions(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    suggestions = crud.get_all_suggestions(db, skip=skip, limit=limit)
    return suggestions

# Get suggestions by category
@app.get("/suggestions/category/{category}", response_model=List[schemas.Suggestion], dependencies=[Depends(oauth2_scheme)])
def read_suggestions_by_category(category: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    suggestions = crud.get_suggestions_by_category(db, category=category, skip=skip, limit=limit)
    return suggestions

# Get suggestions by status
@app.get("/suggestions/status/{status}", response_model=List[schemas.Suggestion], dependencies=[Depends(oauth2_scheme)])
def read_suggestions_by_status(status: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    suggestions = crud.get_suggestions_by_status(db, status=status, skip=skip, limit=limit)
    return suggestions

# Submit an upvote
@app.post("/suggestions/{suggestion_id}/upvote/", response_model=schemas.Upvote, dependencies=[Depends(oauth2_scheme)])
def upvote_suggestion(suggestion_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    upvote = crud.submit_upvote(db, suggestion_id=suggestion_id, user_id=current_user.id)
    return upvote

# Get top suggestions by upvotes
@app.get("/suggestions/top/", response_model=List[schemas.Suggestion], dependencies=[Depends(oauth2_scheme)])
def read_top_suggestions(limit: int = 10, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    suggestions = crud.get_top_suggestions(db, limit=limit)
    return suggestions

# Toggle an upvote
@app.post("/suggestions/{suggestion_id}/toggle_upvote/", response_model=schemas.Upvote, dependencies=[Depends(oauth2_scheme)])
def toggle_upvote(suggestion_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    upvote = crud.toggle_upvote(db, suggestion_id=suggestion_id, user_id=current_user.id)
    return upvote

# Get comments by suggestion
@app.get("/suggestions/{suggestion_id}/comments/", response_model=List[schemas.Comment], dependencies=[Depends(oauth2_scheme)])
def read_comments_by_suggestion(suggestion_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    comments = crud.get_comments_by_suggestion(db, suggestion_id=suggestion_id)
    return comments

# Submit an comment
@app.post("/suggestions/{suggestion_id}/comments/", response_model=schemas.Comment, dependencies=[Depends(oauth2_scheme)])
def create_comment(comment: schemas.CommentCreate, suggestion_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    comment = crud.create_comment(db=db, comment=comment, suggestion_id=suggestion_id, user_id=current_user.id)
    return comment

