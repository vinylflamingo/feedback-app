from sqlalchemy.orm import Session
from sqlalchemy import func, asc, desc
import os
from . import models, schemas
from .models import User
from typing import List, Optional
from fastapi import HTTPException

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


def archive_comment(db: Session, comment_id: int, current_user: User):
    try:
        comment = (
            db.query(models.Comment).filter(models.Comment.id == comment_id).first()
        )
        if not comment:
            return {"error": "Comment not found"}

        if comment.user_id != current_user.id and current_user.role != "admin":
            return {"error": "Not authorized to archive this comment"}

        comment.archived = True
        db.commit()
        db.refresh(comment)
        return comment
    except Exception as e:
        db.rollback()
        return {"error": str(e)}


def get_suggestion_counts(
    db: Session,
    categories: List[str] = [],
    statuses: List[str] = [],
    upvotes: List[int] = [],
):
    counts = {"categories": {}, "statuses": {}, "upvotes": {}}

    if categories:
        for category in categories:
            counts["categories"][category] = (
                db.query(models.Suggestion)
                .filter(
                    models.Suggestion.category == category,
                    models.Suggestion.archived == False,
                )
                .count()
            )

    if statuses:
        for status in statuses:
            counts["statuses"][status] = (
                db.query(models.Suggestion)
                .filter(
                    models.Suggestion.status == status,
                    models.Suggestion.archived == False,
                )
                .count()
            )

    if upvotes:
        for suggestion_id in upvotes:
            counts["upvotes"][suggestion_id] = (
                db.query(models.Upvote)
                .filter(
                    models.Upvote.suggestion_id == suggestion_id,
                    models.Upvote.active == True,
                )
                .count()
            )

    # Format the response
    response = []

    if counts["statuses"]:
        response.append({"type": "status", "data": counts["statuses"]})
    if counts["categories"]:
        response.append({"type": "category", "data": counts["categories"]})
    if counts["upvotes"]:
        response.append({"type": "upvote", "data": counts["upvotes"]})

    return response


# Create a new suggestion
def create_suggestion(db: Session, suggestion: schemas.SuggestionCreate, user_id: int):
    db_suggestion = models.Suggestion(**suggestion.model_dump(), owner_id=user_id)
    db.add(db_suggestion)
    db.commit()
    db.refresh(db_suggestion)
    return db_suggestion


def get_suggestions(
    db: Session,
    suggestion_id: Optional[int] = None,
    limit: int = 10,
    include_archived: bool = False,
    skip: int = 0,
    top: bool = False,
    category: Optional[str] = None,
    status: Optional[str] = None,
    user: Optional[User] = None,
    sort: Optional[str] = None,
) -> List[models.Suggestion]:
    query = db.query(models.Suggestion)

    if user is not None:
        query = query.filter(models.Suggestion.owner_id == user.id)

    if suggestion_id is not None:
        query = query.filter(models.Suggestion.id == suggestion_id)

    if not include_archived:
        query = query.filter(models.Suggestion.archived == False)

    if category:
        query = query.filter(models.Suggestion.category == category)

    if status:
        query = query.filter(models.Suggestion.status == status)

    if top:
        query = (
            query.outerjoin(models.Upvote)
            .group_by(models.Suggestion.id)
            .order_by(func.count(models.Upvote.id).desc())
        )

    if sort == "latest":
        query = query.order_by(desc(models.Suggestion.id))
    elif sort == "oldest":
        query = query.order_by(asc(models.Suggestion.id))
    elif sort == "comments":
        subquery = (
            db.query(
                models.Comment.suggestion_id,
                func.count(models.Comment.id).label("comment_count"),
            )
            .group_by(models.Comment.suggestion_id)
            .subquery()
        )
        query = query.outerjoin(
            subquery, models.Suggestion.id == subquery.c.suggestion_id
        ).order_by(subquery.c.comment_count.asc())

    return query.offset(skip).limit(limit).all()


# Update an existing suggestion
def update_suggestion(
    db: Session,
    suggestion_id: int,
    suggestion_update: schemas.SuggestionUpdate,
    current_user: models.User,
):
    db_suggestion = (
        db.query(models.Suggestion)
        .filter(models.Suggestion.id == suggestion_id)
        .first()
    )

    if not db_suggestion:
        return None

    if db_suggestion.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=403, detail="Not authorized to update this suggestion"
        )

    for key, value in suggestion_update.model_dump(exclude_unset=True).items():
        setattr(db_suggestion, key, value)

    db.commit()
    db.refresh(db_suggestion)
    return db_suggestion
