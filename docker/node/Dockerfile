FROM ubuntu:13.10

RUN echo "deb http://uk.archive.ubuntu.com/ubuntu/ `lsb_release -c -s` main" >> /etc/apt/sources.list
RUN echo "deb http://uk.archive.ubuntu.com/ubuntu/ `lsb_release -c -s` universe" >> /etc/apt/sources.list
RUN apt-get -qq update

###################### Node ######################
RUN apt-get install -y npm imagemagick


##################### Python #####################
RUN apt-get -y -qq install python python-pip python-virtualenv


################### Superviosr ###################
# replace with apt-get?
RUN pip install supervisor
RUN mkdir -p /var/log/supervisor
RUN mkdir -p /etc/supervisor/conf.d
ADD supervisor/supervisord.conf /etc/supervisord.conf


###################### SSH #######################
RUN apt-get -y -qq install openssh-server
RUN mkdir /var/run/sshd
ADD supervisor/sshd.conf /etc/supervisor/conf.d/sshd.conf
# Set root's pass
RUN echo 'root:root' | chpasswd
RUN sed -i.old -r -e 's/^(\w+\s+)(\w+)(\s+pam_loginuid.*)$/\1optional\3/' /etc/pam.d/sshd

###################### APP #######################
RUN npm install -g nodemon@0.7.10
RUN ln -s /usr/bin/nodejs /usr/bin/node
ADD supervisor/node.conf /etc/supervisor/conf.d/node.conf


VOLUME ["/opt/node"]
EXPOSE 22 8080 8090

CMD supervisord
