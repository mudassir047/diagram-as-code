import sys

diagram_name = "default-diagram-name"
if __name__ == "__main__":
    if len(sys.argv) > 1:
        diagram_name = sys.argv[1]
        out_format = sys.argv[2]

