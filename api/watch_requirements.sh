#!/bin/bash

# Function to start the FastAPI app
start_uvicorn() {
  uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload &
  UVICORN_PID=$!
}

# Start the FastAPI app initially
start_uvicorn

# Watch for changes to requirements.txt only
while inotifywait -e modify /api/requirements.txt; do
  echo "requirements.txt modified, updating packages..."
  /api/update_packages.sh

  # Stop the current Uvicorn instance
  kill $UVICORN_PID

  # Wait for a moment to ensure the port is released
  sleep 2

  # Restart the FastAPI app to apply changes
  start_uvicorn
done