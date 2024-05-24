#!/bin/bash

# Function to handle errors
error_handler() {
  echo "Error occurred in script at line: ${BASH_LINENO[0]}"
  echo "Script executed from: ${PWD}"
  exit 1
}

# Trap errors and call the error_handler function
trap 'error_handler' ERR

echo "Script executed from: ${PWD}"

# Start the FastAPI app initially
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload &

# Watch for changes to requirements.txt
while inotifywait -e modify /api/requirements.txt; do
  echo "requirements.txt modified, updating packages..."
  /api/update_packages.sh
done

# Keep the container alive for 30 minutes for debugging
sleep 30m