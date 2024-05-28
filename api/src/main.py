from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import math

from src import models, schemas, crud, database
from src.database import engine, SessionLocal, seed_data
from passlib.context import CryptContext
from src.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    verify_token,
)
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from typing import List, Dict, Any


load_dotenv()

DEV_MODE = os.getenv("DEV_MODE")
SEED_DATA = os.getenv("SEED_DATA")
DEFAULT_RESPONSE_LIMIT = int(
    10
    if os.getenv("DEFAULT_RESPONSE_LIMIT") is None
    else os.getenv("DEFAULT_RESPONSE_LIMIT")
)


print("ENVIRONMENT VARIABLES")
print("DEV MODE")
print(DEV_MODE)
print("SEED DATABASE")
print(SEED_DATA)

models.Base.metadata.create_all(bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


app = FastAPI()
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost",
    "http://[::1]:3000",
    "https://feedback.frankcostoya.com",
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


if SEED_DATA == "True":
    print("hello???")
    seed_data()


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
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


@app.post("/refresh_token", response_model=schemas.Token)
async def refresh_token(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    current_user = verify_token(token, db)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": current_user.username}, expires_delta=access_token_expires
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
@app.post(
    "/suggestions/",
    response_model=schemas.Suggestion,
    dependencies=[Depends(oauth2_scheme)],
)
def create_suggestion(
    suggestion: schemas.SuggestionCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    return crud.create_suggestion(db=db, suggestion=suggestion, user_id=current_user.id)


# Get top suggestions by upvotes
@app.get(
    "/top/",
    response_model=List[schemas.Suggestion],
    dependencies=[Depends(oauth2_scheme)],
)
def read_top_suggestions(
    limit: int = DEFAULT_RESPONSE_LIMIT,
    include_archived: bool = False,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    suggestions = crud.get_top_suggestions(
        db, limit=limit, include_archived=include_archived
    )
    return suggestions


# Get single suggestion
@app.get(
    "/suggestions/{suggestion_id}",
    response_model=schemas.Suggestion,
    dependencies=[Depends(oauth2_scheme)],
)
def read_suggestion(
    suggestion_id: int,
    include_archived: bool = False,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    db_suggestion = crud.get_suggestion(
        db, suggestion_id=suggestion_id, include_archived=include_archived
    )
    if not db_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return db_suggestion


# Edit existing suggestions
@app.put(
    "/suggestions/{suggestion_id}",
    response_model=schemas.Suggestion,
    dependencies=[Depends(oauth2_scheme)],
)
def update_suggestion(
    suggestion_id: int,
    suggestion: schemas.SuggestionUpdate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    db_suggestion = crud.get_suggestion(db, suggestion_id=suggestion_id)
    if not db_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    if db_suggestion.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=403, detail="Not authorized to update this suggestion"
        )
    updated_suggestion = crud.update_suggestion(
        db,
        suggestion_id=suggestion_id,
        suggestion_update=suggestion,
        current_user=current_user,
    )
    if not updated_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return updated_suggestion


# Get all suggestions
@app.get(
    "/suggestions/",
    response_model=List[schemas.Suggestion],
    dependencies=[Depends(oauth2_scheme)],
)
def read_suggestions(
    skip: int = 0,
    limit: int = DEFAULT_RESPONSE_LIMIT,
    include_archived: bool = False,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    suggestions = crud.get_all_suggestions(
        db, skip=skip, limit=limit, include_archived=include_archived
    )
    return suggestions


# Get suggestions by category
@app.get(
    "/suggestions/category/{category}",
    response_model=List[schemas.Suggestion],
    dependencies=[Depends(oauth2_scheme)],
)
def read_suggestions_by_category(
    category: str,
    skip: int = 0,
    include_archived: bool = False,
    limit: int = DEFAULT_RESPONSE_LIMIT,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    suggestions = crud.get_suggestions_by_category(
        db, category=category, skip=skip, limit=limit, include_archived=include_archived
    )
    return suggestions


# Get suggestions by status
@app.get(
    "/suggestions/status/{status}",
    response_model=List[schemas.Suggestion],
    dependencies=[Depends(oauth2_scheme)],
)
def read_suggestions_by_status(
    status: str,
    skip: int = 0,
    include_archived: bool = False,
    limit: int = DEFAULT_RESPONSE_LIMIT,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    suggestions = crud.get_suggestions_by_status(
        db, status=status, skip=skip, limit=limit, include_archived=include_archived
    )
    return suggestions


# Submit an upvote
@app.post(
    "/suggestions/{suggestion_id}/upvote/",
    response_model=schemas.Upvote,
    dependencies=[Depends(oauth2_scheme)],
)
def upvote_suggestion(
    suggestion_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    upvote = crud.submit_upvote(
        db, suggestion_id=suggestion_id, user_id=current_user.id
    )
    return upvote


# Toggle an upvote
@app.post(
    "/suggestions/{suggestion_id}/toggle_upvote/",
    response_model=schemas.Upvote,
    dependencies=[Depends(oauth2_scheme)],
)
def toggle_upvote(
    suggestion_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    upvote = crud.toggle_upvote(
        db, suggestion_id=suggestion_id, user_id=current_user.id
    )
    return upvote


# Get comments by suggestion
@app.get(
    "/suggestions/{suggestion_id}/comments/",
    response_model=List[schemas.Comment],
    dependencies=[Depends(oauth2_scheme)],
)
def read_comments_by_suggestion(
    suggestion_id: int,
    include_archived: bool = False,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    comments = crud.get_comments_by_suggestion(
        db, suggestion_id=suggestion_id, include_archived=include_archived
    )
    return comments


# Submit an comment
@app.post(
    "/suggestions/{suggestion_id}/comments/",
    response_model=schemas.Comment,
    dependencies=[Depends(oauth2_scheme)],
)
def create_comment(
    comment: schemas.CommentCreate,
    suggestion_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    current_user = get_current_user(db=db, token=token)
    comment = crud.create_comment(
        db=db, comment=comment, suggestion_id=suggestion_id, user_id=current_user.id
    )
    return comment
