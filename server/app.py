from flask import Flask, send_file, request
import os, subprocess, logging, shutil, uuid

# Configure logging
logging.basicConfig(filename='./generated/diagram-as-code.log', level=logging.INFO)

app = Flask(__name__)

@app.route('/status')
def hello():
    return 'OK'

@app.route('/v1/get-diagram')
def get_diagram():
    unique_file_id = request.args.get('file_id', '')  # Get the diagram name from the 'name' query parameter
    if not unique_file_id:
        return "Please provide a diagram file_id in the URL query parameters.", 400
    
    # Construct the filename by replacing '-' with ' ' and appending '.png'
    filename = './generated/' + unique_file_id + '.png'
    app.logger.info("Filename: " + filename)
    filepath = os.path.join(os.getcwd(), filename)
    
    if not os.path.exists(filepath):
        return f"Diagram '{unique_file_id}' not found.", 404
    
    return send_file(filepath, mimetype='image/png')


# Request Body
# {
#     "python_code": "app.logger.info('Hello, world!')",
#     "file_id": "FILE_ID",
# }

@app.route('/v1/generate-diagram', methods=['POST'])
def generate_diagram():
    python_code = request.json.get('python_code', '')
    diagram_name = request.json.get('name', '')

    app.logger.info(f"Code received: ${python_code}")
    app.logger.info(f"Name received: ${diagram_name}")

    if not python_code:
        return "Please provide Python code in the request body.", 400
    
    if not diagram_name:
        return "Please provide diagram name in the request body.", 400
    
    with open('./generated/diagram.py', 'w') as f:
        f.write(python_code)
    
    app.logger.info(f"File written: /app/generated/diagram.py")

    try:
        subprocess.run(['python', "./generated/diagram.py", diagram_name], capture_output=True, check=True)
        destination_folder = "./generated/"
        unique_file_id = str(uuid.uuid4())
        file_name = diagram_name + '.png'
        os.rename(file_name, unique_file_id + '.png')
        shutil.move(unique_file_id + '.png', destination_folder)
        return {
            "message": "Diagram generated successfully. Run: `npm run get-diagram " + unique_file_id + " [<output dir location>]`",
            "fileId" : unique_file_id
        }, 200
    except subprocess.CalledProcessError:
        return "Error generating diagram.", 500



if __name__ == '__main__':
     # Use Gunicorn instead of Flask's built-in development server
    import gunicorn.app.base
    from gunicorn_config import bind, workers, max_requests, timeout, accesslog, errorlog

    class StandaloneApplication(gunicorn.app.base.BaseApplication):
        def __init__(self, app, options=None):
            self.options = options or {}
            self.application = app
            super().__init__()

        def load_config(self):
            for key, value in self.options.items():
                self.cfg.set(key, value)

        def load(self):
            return self.application

    options = {
        'bind': bind,
        'workers': workers,
        'max_requests': max_requests,
        'timeout': timeout,
        'accesslog': accesslog,
        'errorlog': errorlog
    }

    StandaloneApplication(app, options).run()
    