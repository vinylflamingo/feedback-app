# Use the official Python image as the base image
FROM python:3.10

# Install inotify-tools
RUN apt-get update && apt-get install -y inotify-tools

# Set the working directory in the container
WORKDIR /api/src

# Copy the requirements file into the container
COPY requirements.txt /api/

COPY seed_data.json /api/

# Install the dependencies
RUN pip install --no-cache-dir -r /api/requirements.txt

# Copy the update and watch scripts into the container
COPY update_packages.sh /api/update_packages.sh
COPY watch_requirements.sh /api/watch_requirements.sh

# Make the scripts executable
RUN chmod +x /api/update_packages.sh /api/watch_requirements.sh

# Expose the port on which the app will run
EXPOSE 8000

WORKDIR /api

# Command to run the watch script
CMD ["./watch_requirements.sh"]