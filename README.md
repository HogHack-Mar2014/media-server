# Node App

run:
  node app.js

# Docker
## Node

To create image:

    sudo docker build -t node docker/node

To run it:

    docker run -d -p 8000:8000 -p 122:22 -v /path/to/code:/opt/node:rw node

To ssh (root:root):
    ssh 0.0.0.0 -p 122 -o "UserKnownHostsFile /dev/null" -o "LogLevel ERROR" -o "StrictHostKeyChecking no"

