# Dockerfile

This Dockerfile sets up a Docker image for running a Flask application using Gunicorn as the production server.

## Base Image

- Uses the official Python image as the base image with Python version 3.8.10-slim.

## Dependencies

- Installs pipenv for managing Python dependencies.
- Installs Graphviz using apt-get.

## Working Directory

- Sets the working directory in the container to /app.

## Copy Files

- Copies the Pipfile and Pipfile.lock to the working directory.
- Copies the Flask application code to the container.

## Exposed Ports

- Exposes port 8500 to the host machine.

## Command

- Runs the Flask application using Gunicorn with a provided configuration file (gunicorn_config.py).

## Image Build
- Navigate to workspace where the Dockerfile is present.
Run:
```
docker build -t diagram-as-code:latest .
```

## Run

```
docker run -p 8500:8500 diagram-as-code

OR with volume:

docker run -d -v /host/path:/app/generated:rw -p 8500:8500 diagram-as-code
```

## Access Container
```
# get container id from `docker container ls`
 
 docker exec -it CONTAINER_ID bash
```