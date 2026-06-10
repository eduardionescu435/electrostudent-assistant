FROM python:3.11-slim

WORKDIR /app

# Install dependencies separately to cache the layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Start the Flask development server on all interfaces
CMD ["python", "manage.py", "run", "--host", "0.0.0.0"]
