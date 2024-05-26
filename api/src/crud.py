from sqlalchemy.orm import Session
from sqlalchemy import func
from src import models, schemas
import os

DEFAULT_RESPONSE_LIMIT = int(
    10
    if os.getenv("DEFAULT_RESPONSE_LIMIT") is None
    else os.getenv("DEFAULT_RESPONSE_LIMIT")
)


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_suggestions_count(db: Session, include_archived: bool = False):
    if not include_archived:
        return (
            db.query(models.Suggestion)
            .filter(models.Suggestion.archived == False)
            .count()
        )

    return db.query(models.Suggestion).count()


def get_suggestion(db: Session, suggestion_id: int):
    return (
        db.query(models.Suggestion)
        .filter(models.Suggestion.id == suggestion_id)
        .first()
    )


def get_all_suggestions(
    db: Session,
    skip: int = 0,
    limit: int = DEFAULT_RESPONSE_LIMIT,
    include_archived: bool = False,
):
    if include_archived:
        return db.query(models.Suggestion).offset(skip).limit(limit).all()
    return (
        db.query(models.Suggestion)
        .filter(models.Suggestion.archived == False)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_suggestions_by_category(
    db: Session,
    category: str,
    skip: int = 0,
    limit: int = DEFAULT_RESPONSE_LIMIT,
    include_archived: bool = False,
):
    if include_archived:
        return (
            db.query(models.Suggestion)
            .filter(models.Suggestion.category == category)
            .offset(skip)
            .limit(limit)
            .all()
        )
    return (
        db.query(models.Suggestion)
        .filter(models.Suggestion.category == category)
        .filter(models.Suggestion.archived == False)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_suggestions_by_status(
    db: Session,
    status: str,
    skip: int = 0,
    limit: int = DEFAULT_RESPONSE_LIMIT,
    include_archived: bool = False,
):
    if include_archived:
        return (
            db.query(models.Suggestion)
            .filter(models.Suggestion.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )

    return (
        db.query(models.Suggestion)
        .filter(models.Suggestion.status == status)
        .filter(models.Suggestion.archived == False)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_suggestion(db: Session, suggestion: schemas.SuggestionCreate, user_id: int):
    db_suggestion = models.Suggestion(**suggestion.model_dump(), owner_id=user_id)
    db.add(db_suggestion)
    db.commit()
    db.refresh(db_suggestion)
    return db_suggestion


def update_suggestion(
    db: Session, suggestion_id: int, suggestion_update: schemas.SuggestionUpdate
):
    db_suggestion = (
        db.query(models.Suggestion)
        .filter(models.Suggestion.id == suggestion_id)
        .first()
    )
    if not db_suggestion:
        return None
    for key, value in suggestion_update.model_dump(exclude_unset=True).items():
        setattr(db_suggestion, key, value)
    db.commit()
    db.refresh(db_suggestion)
    return db_suggestion


def create_comment(
    db: Session, comment: schemas.CommentCreate, suggestion_id: int, user_id: int
):
    db_comment = models.Comment(
        **comment.model_dump(), suggestion_id=suggestion_id, user_id=user_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def submit_upvote(db: Session, suggestion_id: int, user_id: int):
    upvote = (
        db.query(models.Upvote)
        .filter(
            models.Upvote.suggestion_id == suggestion_id,
            models.Upvote.user_id == user_id,
        )
        .first()
    )
    if not upvote:
        upvote = models.Upvote(
            suggestion_id=suggestion_id, user_id=user_id, active=True
        )
        db.add(upvote)
    else:
        upvote.active = True
    db.commit()
    db.refresh(upvote)
    return upvote


def get_top_suggestions(
    db: Session, limit: int = DEFAULT_RESPONSE_LIMIT, include_archived: bool = False
):
    subquery = (
        db.query(
            models.Upvote.suggestion_id,
            func.count(models.Upvote.id).label("upvote_count"),
        )
        .filter(models.Upvote.active == True)
        .group_by(models.Upvote.suggestion_id)
        .subquery()
    )

    suggestions = (
        db.query(models.Suggestion, subquery.c.upvote_count)
        .outerjoin(subquery, models.Suggestion.id == subquery.c.suggestion_id)
        .order_by(subquery.c.upvote_count.desc())
    )
    if not include_archived:
        suggestions.filter(models.Suggestion.archived == False)

    suggestions.limit(limit).all()

    return [suggestion for suggestion, _ in suggestions]


def toggle_upvote(db: Session, suggestion_id: int, user_id: int):
    upvote = (
        db.query(models.Upvote)
        .filter(
            models.Upvote.suggestion_id == suggestion_id,
            models.Upvote.user_id == user_id,
        )
        .first()
    )
    if not upvote:
        upvote = models.Upvote(
            suggestion_id=suggestion_id, user_id=user_id, active=True
        )
        db.add(upvote)
    else:
        upvote.active = not upvote.active
    db.commit()
    db.refresh(upvote)
    return upvote


def get_comments_by_suggestion(
    db: Session, suggestion_id: int, include_archived: bool = False
):
    comments = (
        db.query(models.Comment)
        .filter(models.Comment.suggestion_id == suggestion_id)
        .order_by(models.Comment.created_at)
    )

    if not include_archived:
        comments.filter(models.Suggestion.archived == False)

    comments.all()

    comments_by_id = {comment.id: comment for comment in comments}
    for comment in comments:
        if comment.parent_comment_id:
            parent = comments_by_id.get(comment.parent_comment_id)
            if parent:
                if not hasattr(parent, "replies"):
                    parent.replies = []
                parent.replies.append(comment)
    return [comment for comment in comments if not comment.parent_comment_id]


def archive_suggestion(db: Session, suggestion_id: int):
    suggestion = (
        db.query(models.Suggestion)
        .filter(models.Suggestion.id == suggestion_id)
        .first()
    )
    suggestion.archived = True
    db.commit()
    db.refresh(suggestion)
    return suggestion


def archive_comment(db: Session, comment_id: int):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    comment.archived = True
    db.commit()
    db.refresh(comment)
    return comment
