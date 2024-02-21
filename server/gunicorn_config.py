import multiprocessing

# Bind to the specified IP address and port
bind = '0.0.0.0:8500'

# Number of worker processes (adjust based on your server's resources)
workers = multiprocessing.cpu_count() * 2 + 1

# Set the maximum number of requests a worker can handle before restarting
max_requests = 500

# Set the maximum number of seconds a worker can run before restarting
timeout = 30

# Logging configuration
accesslog = '-'  # Log to stdout
errorlog = '-'   # Log to stderr
loglevel = 'info'