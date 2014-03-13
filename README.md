# Node App

run:
  node app.js

# Docker
## Node

To create images:

    sudo docker build -t node docker/node
    sudo docker build -t solr docker/solr

To run it:

    docker run --tty -d -p 3000:3000 -p 2022:22 -v /path/to/code:/opt/node:rw node
    docker run --tty -d -p 8983:8983 -p 3022:22 -v `pwd`/solr:/opt/solr_data:rw solr

To ssh (root:root):
    ssh 0.0.0.0 -p 122 -o "UserKnownHostsFile /dev/null" -o "LogLevel ERROR" -o "StrictHostKeyChecking no"
    ssh -p 2022 root@localhost

