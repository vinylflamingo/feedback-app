FROM python:3.12.3-slim


WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    python3-pip \
    && apt-get clean

# Install pipx
RUN pip install pipx && pipx ensurepath

# Install Poetry using pipx
RUN pipx install poetry

# Add Poetry to PATH (this ensures the Poetry binary is in the PATH)
ENV PATH="/root/.local/bin:$PATH"

# Copy project files
COPY pyproject.toml poetry.lock ./

# Install project dependencies
RUN poetry config virtualenvs.create false && poetry install --no-dev

# Copy the rest of the application files
COPY . .

# Set the working directory to /app/src
WORKDIR /app

# Command to run the application
CMD ["poetry", "run", "fastapi", "run", "src/main.py"]
