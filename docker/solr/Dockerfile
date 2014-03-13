FROM ubuntu:13.10

RUN echo "deb http://uk.archive.ubuntu.com/ubuntu/ `lsb_release -c -s` main" >> /etc/apt/sources.list
RUN echo "deb http://uk.archive.ubuntu.com/ubuntu/ `lsb_release -c -s` universe" >> /etc/apt/sources.list
RUN apt-get -qq update

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


###################### Solr ######################
RUN apt-get install -qqy openjdk-7-jre-headless
RUN wget --progress=bar:force http://mirrored-packages.s3-website-us-west-1.amazonaws.com/packages/solr-4.2.0.tgz
RUN tar --extract --file solr-4.2.0.tgz -C /opt
RUN mv /opt/solr-4.2.0 /opt/solr
ADD supervisor/solr.conf /etc/supervisor/conf.d/solr.conf


VOLUME ["/opt/solr_data"]
EXPOSE 22 8983

CMD supervisord
