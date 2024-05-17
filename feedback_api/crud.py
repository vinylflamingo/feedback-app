# crud.py
from sqlalchemy.orm import Session
from feedback_api import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_suggestion(db: Session, suggestion_id: int):
    return db.query(models.Suggestion).filter(models.Suggestion.id == suggestion_id).first()

def get_suggestions(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Suggestion).offset(skip).limit(limit).all()

def create_suggestion(db: Session, suggestion: schemas.SuggestionCreate, user_id: int):
    db_suggestion = models.Suggestion(**suggestion.dict(), owner_id=user_id)
    db.add(db_suggestion)
    db.commit()
    db.refresh(db_suggestion)
    return db_suggestion

def create_comment(db: Session, comment: schemas.CommentCreate, feedback_id: int, user_id: int):
    db_comment = models.Comment(**comment.dict(), feedback_id=feedback_id, comment=comment, user_id = user_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first() 

def get_all_suggestions(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Suggestion).offset(skip).limit(limit).all()

def get_suggestions_by_category(db: Session, category: str, skip: int = 0, limit: int = 10):
    return db.query(models.Suggestion).filter(models.Suggestion.category == category).offset(skip).limit(limit).all()

def get_suggestions_by_status(db: Session, status: str, skip: int = 0, limit: int = 10):
    return db.query(models.Suggestion).filter(models.Suggestion.status == status).offset(skip).limit(limit).all()

def submit_upvote(db: Session, suggestion_id: int, user_id: int):
    upvote = db.query(models.Upvote).filter(models.Upvote.suggestion_id == suggestion_id, models.Upvote.user_id == user_id).first()
    if not upvote:
        upvote = models.Upvote(suggestion_id=suggestion_id, user_id=user_id, active=True)
        db.add(upvote)
    else:
        upvote.active = True
    db.commit()
    db.refresh(upvote)
    return upvote

def get_top_suggestions(db: Session, limit: int = 10):
    return db.query(models.Suggestion).order_by(models.Suggestion.upvotes.desc()).limit(limit).all()

def toggle_upvote(db: Session, suggestion_id: int, user_id: int):
    upvote = db.query(models.Upvote).filter(models.Upvote.suggestion_id == suggestion_id, models.Upvote.user_id == user_id).first()
    if not upvote:
        upvote = models.Upvote(suggestion_id=suggestion_id, user_id=user_id, active=True)
        db.add(upvote)
    else:
        upvote.active = not upvote.active
    db.commit()
    db.refresh(upvote)
    return upvote

def get_comments_by_suggestion(db: Session, suggestion_id: int):
    comments = db.query(models.Comment).filter(models.Comment.suggestion_id == suggestion_id).order_by(models.Comment.created_at).all()
    comments_by_id = {comment.id: comment for comment in comments}
    for comment in comments:
        if comment.parent_comment_id:
            parent = comments_by_id.get(comment.parent_comment_id)
            if parent:
                if not hasattr(parent, 'replies'):
                    parent.replies = []
                parent.replies.append(comment)
    return [comment for comment in comments if not comment.parent_comment_id]