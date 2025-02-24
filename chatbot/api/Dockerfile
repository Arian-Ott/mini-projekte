# ===== Stage 1: Build Stage =====
FROM python:3.13-rc-slim AS builder

# Labels for documentation
LABEL maintainer="Arian Ott <88984301+Arian-Ott@users.noreply.github.com >"
LABEL description="FastAPI chatbot application container"
LABEL version="1.0.0"
LABEL license="MIT"
LABEL repository="https://github.com/Arian-Ott/mini-projekte/chatbot/api"
LABEL documentation="https://github.com/Arian-Ott/mini-projekte/chatbot/"

WORKDIR /app

# Copy only the requirements file for caching
COPY requirements.txt .

# Install required system dependencies
RUN apt-get update && apt-get install -y gcc

# Set up a virtual environment and install dependencies
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt 

# Cleanup to reduce image size
RUN rm -rf /var/lib/apt/lists/* && \
    apt-get purge -y --auto-remove gcc && \
    rm requirements.txt

# ===== Stage 2: Final Runtime Image =====
FROM python:3.13-rc-slim AS runtime

# Labels for metadata in the final image
LABEL maintainer="Arian Ott <88984301+Arian-Ott@users.noreply.github.com >"
LABEL description="Production grade FastAPI chatbot application container"
LABEL version="1.0.0"
LABEL license="MIT"
LABEL repository="https://github.com/Arian-Ott/mini-projekte/chatbot/api"
LABEL documentation="https://github.com/Arian-Ott/mini-projekte/chatbot/"

WORKDIR /app

# Copy virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Set environment variables for better Python performance
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Copy application code
COPY . . 

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI server with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]