from fastapi import FastAPI, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
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
from typing import List


load_dotenv()

DEV_MODE = os.getenv("DEV_MODE") or False
SEED_DATA = os.getenv("SEED_DATA") or False
DEFAULT_RESPONSE_LIMIT = int(
    10
    if os.getenv("DEFAULT_RESPONSE_LIMIT") is None
    else os.getenv("DEFAULT_RESPONSE_LIMIT")
)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")) or 30

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
    allow_origin_regex="https?:\/\/(?:[^\/]+\.?)?vinylflamingos-projects\.vercel\.app(?:\/[^\s]*)?",
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
    seed_data()


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    if DEV_MODE == "True":
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
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
    }


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
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": current_user.id,
        "username": current_user.username,
    }


@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


# Submit an comment
@app.post(
    "/suggestions/{suggestion_id}/comments",
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


# Simplified upvote route
@app.post("/upvote/{suggestion_id}")
def toggle_upvote(
    suggestion_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    upvote = (
        db.query(models.Upvote)
        .filter(
            models.Upvote.suggestion_id == suggestion_id,
            models.Upvote.user_id == current_user.id,
        )
        .first()
    )
    if upvote:
        upvote.active = not upvote.active
    else:
        upvote = models.Upvote(
            suggestion_id=suggestion_id, user_id=current_user.id, active=True
        )
        db.add(upvote)
    db.commit()
    db.refresh(upvote)
    return upvote


@app.get("/suggestion-counts", dependencies=[Depends(oauth2_scheme)])
def suggestion_counts(
    categories: List[str] = Query([]),
    statuses: List[str] = Query([]),
    upvotes: List[int] = Query([]),
    db: Session = Depends(get_db),
):
    return crud.get_suggestion_counts(
        db=db, categories=categories, statuses=statuses, upvotes=upvotes
    )


# Get suggestions (all, by id, top, by category, by status)
@app.get(
    "/suggestions",
    response_model=List[schemas.Suggestion],
    dependencies=[Depends(oauth2_scheme)],
)
def read_suggestions(
    suggestion_id: Optional[int] = None,
    limit: int = Query(10, alias="limit"),
    include_archived: bool = False,
    skip: int = 0,
    top: bool = False,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    user: bool = False,
    sort: str = "latest",
):
    if user == True:
        current_user = get_current_user(db=db, token=token)
    else:
        current_user = (
            None  # only need this if we are looking for suggestions by a specific user.
        )
    suggestions = crud.get_suggestions(
        db=db,
        suggestion_id=suggestion_id,
        limit=limit,
        include_archived=include_archived,
        skip=skip,
        top=top,
        category=category,
        status=status,
        user=current_user,
        sort=sort,
    )
    return suggestions


# Post new suggestions
@app.post(
    "/suggestions",
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


# Edit existing suggestions
@app.put(
    "/suggestions",
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
    updated_suggestion = crud.update_suggestion(
        db=db,
        suggestion_id=suggestion_id,
        suggestion_update=suggestion,
        current_user=current_user,
    )
    if not updated_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return updated_suggestion
