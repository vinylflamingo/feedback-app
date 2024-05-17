# models.py
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, LargeBinary, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    profile_picture = Column(LargeBinary)
    suggestions = relationship("Suggestion", back_populates="owner")
    comments = relationship("Comment", back_populates="user")
    upvotes = relationship("Upvote", back_populates="user")

class Suggestion(Base):
    __tablename__ = 'suggestions'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    detail = Column(Text)
    category = Column(String)
    status = Column(String)
    completed = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship("User", back_populates="suggestions")
    comments = relationship("Comment", back_populates="suggestion")
    upvotes = relationship("Upvote", back_populates="suggestion")

class Upvote(Base):
    __tablename__ = 'upvotes'
    id = Column(Integer, primary_key=True, index=True)
    suggestion_id = Column(Integer, ForeignKey('suggestions.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    active = Column(Boolean, default=True)
    suggestion = relationship("Suggestion", back_populates="upvotes")
    user = relationship("User", back_populates="upvotes")

class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True, index=True)
    suggestion_id = Column(Integer, ForeignKey('suggestions.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    parent_comment_id = Column(Integer, ForeignKey('comments.id'), nullable=True)
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    suggestion = relationship("Suggestion", back_populates="comments")
    user = relationship("User", back_populates="comments")
    parent_comment = relationship("Comment", remote_side=[id], back_populates="children")
    children = relationship("Comment", back_populates="parent_comment")
