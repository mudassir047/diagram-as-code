For running a Flask app in a production environment, you typically want to use a production-ready server like Gunicorn or uWSGI. Additionally, you may want to configure your Flask app for better performance, security, and reliability. Here's a basic production configuration for running a Flask app using Gunicorn:

1. **Install Dependencies**: First, make sure you have Gunicorn installed in your virtual environment:

   ```bash
   pip install gunicorn
   ```

2. **Create a Gunicorn Configuration File**: Create a Gunicorn configuration file (e.g., `gunicorn_config.py`) with appropriate settings:

   ```python
   import multiprocessing
   
   # Bind to the specified IP address and port
   bind = '0.0.0.0:8000'
   
   # Number of worker processes (adjust based on your server's resources)
   workers = multiprocessing.cpu_count() * 2 + 1
   
   # Set the maximum number of requests a worker can handle before restarting
   max_requests = 1000
   
   # Set the maximum number of seconds a worker can run before restarting
   timeout = 30
   
   # Logging configuration
   accesslog = '-'  # Log to stdout
   errorlog = '-'   # Log to stderr
   ```

3. **Update Your Flask App**: Modify your Flask app to use the production server. In your main application file (e.g., `app.py`), update the Flask `app.run()` call to use Gunicorn:

   ```python
   from your_app import create_app
   
   app = create_app()
   
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
   ```

4. **Run Your Flask App with Gunicorn**: Run your Flask app using Gunicorn with the provided configuration file:

   ```bash
   gunicorn -c gunicorn_config.py app:app
   ```

This configuration provides a basic setup for running a Flask app in a production environment using Gunicorn. Make sure to adjust the settings (such as the number of workers and the bind address) based on your server's resources and requirements. Additionally, consider using a reverse proxy server (e.g., Nginx or Apache) to handle client requests and serve static files for better performance and security.