# database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from passlib.context import CryptContext
import json
from .models import User, Suggestion, Comment, Upvote

load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

db_url = (
    "postgresql://"
    + POSTGRES_USER
    + ":"
    + POSTGRES_PASSWORD
    + "@"
    + POSTGRES_HOST
    + ":"
    + POSTGRES_PORT
    + "/"
    + POSTGRES_DB
)
print(db_url)

engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_data():
    seed_file_path = os.path.join(os.path.dirname(__file__), "..", "seed_data.json")

    try:
        with open(seed_file_path, "r") as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"Error: {seed_file_path} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: {seed_file_path} contains invalid JSON.")
        return

    session = SessionLocal()

    try:
        # Ensure admin, demo, and dev users are present
        admin_user = session.query(User).filter(User.username == "admin").first()
        demo_user = session.query(User).filter(User.username == "demo").first()
        dev_user = session.query(User).filter(User.username == "dev_user").first()

        if not admin_user:
            admin_user = User(
                username="admin",
                password=pwd_context.hash("music sounds better with you"),
                first_name="Admin",
                last_name="User",
                email="admin@example.com",
                role="admin",
            )
            session.add(admin_user)

        if not demo_user:
            demo_user = User(
                username="demo",
                password=pwd_context.hash("hello world"),
                first_name="Demo",
                last_name="User",
                email="demo@example.com",
            )
            session.add(demo_user)

        if not dev_user:
            dev_user = User(
                username="dev_user",
                password=pwd_context.hash("dev_password"),
                first_name="Dev",
                last_name="User",
                email="dev@example.com",
                role="admin",
            )
            session.add(dev_user)

        session.commit()

        # Add remaining users
        for user_data in data["users"]:
            if user_data["username"] not in ["admin", "demo", "dev_user"]:
                user_data["password"] = pwd_context.hash(user_data["password"])
                if user_data["profile_picture"] is None:
                    user_data["profile_picture"] = None
                else:
                    user_data["profile_picture"] = bytes(
                        user_data["profile_picture"], "utf-8"
                    )

                existing_user = (
                    session.query(User).filter(User.id == user_data["id"]).first()
                )
                if existing_user:
                    print(f"Skipped user with ID {user_data['id']} - already exists.")
                else:
                    user = User(**user_data)
                    session.add(user)
                    print(f"Created user with ID {user_data['id']} - {user.username}")

        session.commit()

        # Add suggestions
        for suggestion_data in data["suggestions"]:
            existing_suggestion = (
                session.query(Suggestion)
                .filter(Suggestion.id == suggestion_data["id"])
                .first()
            )
            if existing_suggestion:
                print(
                    f"Skipped suggestion with ID {suggestion_data['id']} - already exists."
                )
            else:
                suggestion = Suggestion(**suggestion_data)
                session.add(suggestion)
                print(
                    f"Created suggestion with ID {suggestion_data['id']} - {suggestion.title}"
                )

        session.commit()

        # Add comments
        for comment_data in data["comments"]:
            existing_comment = (
                session.query(Comment).filter(Comment.id == comment_data["id"]).first()
            )
            if existing_comment:
                print(f"Skipped comment with ID {comment_data['id']} - already exists.")
            else:
                comment = Comment(**comment_data)
                session.add(comment)
                print(f"Created comment with ID {comment_data['id']} - {comment.text}")

        session.commit()

        # Add upvotes
        for upvote_data in data["upvotes"]:
            existing_upvote = (
                session.query(Upvote).filter(Upvote.id == upvote_data["id"]).first()
            )
            if existing_upvote:
                print(f"Skipped upvote with ID {upvote_data['id']} - already exists.")
            else:
                upvote = Upvote(**upvote_data)
                session.add(upvote)
                print(f"Created upvote with ID {upvote_data['id']} - {upvote.user_id}")

        session.commit()

    except Exception as e:
        session.rollback()
        print(f"An error occurred: {e}")
    finally:
        session.close()
