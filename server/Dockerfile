# Use the official Python image as base image
FROM python:3.8.10-slim

# Install pipenv
RUN pip install pipenv

# Install Graphviz
RUN apt-get update && apt-get install -y graphviz

# Set the working directory in the container
WORKDIR /app

VOLUME "./generated"

# Copy the Pipfile and Pipfile.lock to the working directory
COPY Pipfile Pipfile.lock ./

# Install dependencies using pipenv
RUN pipenv install --deploy --system

# Copy the Flask application code to the container
COPY . .

# Expose port 8500 to the host machine
EXPOSE 8500

# Command to run the Flask application
# CMD ["python", "app.py"]
CMD ["gunicorn", "-c", "gunicorn_config.py", "app:app"]
