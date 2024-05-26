# schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class CommentBase(BaseModel):
    text: str
    parent_comment_id: Optional[int] = None


class CommentCreate(CommentBase):
    pass


class Comment(CommentBase):
    id: int
    suggestion_id: int
    user_id: int
    created_at: datetime
    children: List["Comment"] = []

    class Config:
        orm_mode = True


class SuggestionBase(BaseModel):
    title: str
    detail: str
    category: str
    status: str
    completed: bool = False


class SuggestionCreate(SuggestionBase):
    pass


class SuggestionUpdate(BaseModel):
    title: Optional[str] = None
    detail: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    completed: Optional[bool] = None

    class Config:
        orm_mode = True


class Suggestion(SuggestionBase):
    id: int
    owner_id: int
    comments: List[Comment] = []
    upvote_count: int

    class Config:
        orm_mode = True


class UpvoteBase(BaseModel):
    suggestion_id: int
    user_id: int
    active: bool


class UpvoteCreate(UpvoteBase):
    pass


class Upvote(UpvoteBase):
    id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    profile_picture: Optional[bytes] = None
    suggestions: list[Suggestion] = []
    comments: list[Comment] = []
    upvotes: list[int] = []

    class Config:
        from_attributes = True
