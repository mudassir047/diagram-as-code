# Diagram-as-Code Server

## Description

This Flask application provides endpoints for interacting with a diagram-as-code server. It allows users to check the server status, generate diagrams from Python code, and retrieve generated diagrams.

## Endpoints

### 1. `/status` (GET)

- **Description**: Checks whether the diagram-as-code server is running.
- **Response**: Returns "OK" if the server is running.

### 2. `/v1/generate-diagram` (POST)

- **Description**: Generates a diagram from Python code and saves it as an image file.
- **Request Body**:
  - `python_code`: The Python script code to generate the diagram.
  - `out_format`: <png|jpg|pdf|svg|dot>
- **Response**: Generates a diagram using the provided Python code and saves it with the specified name.

### 3. `/v1/get-diagram` (GET)

- **Description**: Retrieves a previously generated diagram.
- **Query Parameters**:
  - `file_id`: The id of the diagram to retrieve.
  - `out_format`: <png|jpg|pdf|svg|dot>
- **Response**: Retrieves the specified diagram file.

## Usage

1. **Check Server Status**:
   ```bash
   GET /status
   ```

2. **Generate Diagram**:
   ```bash
   POST /v1/generate-diagram
   {
       "python_code": "<python_script_code>",
       "out_format": "<png|jpg|pdf|svg|dot>"
   }
   ```
   Sample Response:
   ```json
   {
      "fileId": "ed25f284-7c47-4f6f-a168-60e92bca9ad6",
      "message": "Diagram generated successfully. Run: `get-diagram --file=ed25f284-7c47-4f6f-a168-60e92bca9ad6 [--outdir=<out dir location>] [--format=<[png|jpg|pdf|svg|dot]>]`"
   }
   ```

3. **Get Generated Diagram**:
   ```bash
   GET /v1/get-diagram?file_id=<file_id>&out_format=<[png|jpg|pdf|svg|dot]>
   ```


## Installation

1. Clone the repository.
2. Build Image:
   ```bash
    docker build --no-cache -t diagram-as-code:latest .
   ```
3. To run the application:
   ```bash
   docker run --name diagram-as-code -p 8500:8500 diagram-as-code

   OR with volume:

   docker run -d --name diagram-as-code  -v /host/path:/app/generated:rw -p 8500:8500 diagram-as-code
   ```

4. To check server is running:
    ```bash
    curl http://localhost:8500/status
    ```
    Result should be: OK

# Dependencies

## Flask

- **Description**: Flask is a lightweight WSGI web application framework for Python. It is designed to make getting started quick and easy, with the ability to scale up to complex applications.
- **Version**: *
- **Source**: [PyPI](https://pypi.org/project/Flask/)
- **Documentation**: [Flask Documentation](https://flask.palletsprojects.com/)

## Diagrams

- **Description**: Diagrams is a Python library that allows you to programmatically create diagrams using a simple and intuitive syntax. It supports various types of diagrams such as network diagrams, architecture diagrams, flowcharts, and more.
- **Version**: *
- **Source**: [PyPI](https://pypi.org/project/diagrams/)
- **Documentation**: [Diagrams Documentation](https://diagrams.mingrammer.com/)

## Gunicorn

- **Description**: Gunicorn is a Python WSGI HTTP server for UNIX. It is widely used as a production server for running Python web applications such as Flask apps. Gunicorn provides scalability, concurrency, and graceful handling of web requests.
- **Version**: *
- **Source**: [PyPI](https://pypi.org/project/gunicorn/)
- **Documentation**: [Gunicorn Documentation](https://docs.gunicorn.org/en/stable/)


## Author

Mudassir Siddiqui
