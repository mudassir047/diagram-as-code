import sys

diagram_name = "default-diagram-name"

if __name__ == "__main__":
    # Check if any arguments are passed
    if len(sys.argv) > 1:
        # Print the first argument
        print("Name argument passed:", sys.argv[1])
        diagram_name = sys.argv[1]