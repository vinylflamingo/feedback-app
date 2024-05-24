#!/bin/bash

# Install new dependencies
pip install --no-cache-dir -r /api/requirements.txt

# Restart the FastAPI app
pkill -f uvicorn
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload