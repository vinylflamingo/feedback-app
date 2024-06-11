# Base stage
FROM python:3.12.3-slim AS base

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

# Development stage (default)
FROM base AS development
EXPOSE 8123
CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8123", "--reload"]

# Production stage
FROM base AS production
CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8123"]

# Default stage to be built if no target is specified
FROM development AS default
