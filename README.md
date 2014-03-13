# Node App

run:
  node app.js

# Docker
## Node

To create image:

    sudo docker build -t node docker/node

To run it:

    docker run -d -p 3000:3000 -p 2022:22 -v /path/to/code:/opt/node:rw node

To ssh (root:root):
    ssh 0.0.0.0 -p 122 -o "UserKnownHostsFile /dev/null" -o "LogLevel ERROR" -o "StrictHostKeyChecking no"
    ssh -p 2022 root@localhost

