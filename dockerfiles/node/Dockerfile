FROM debian
MAINTAINER Raboliot <raboliot@raboland.fr>

RUN apt-get update && apt-get -y upgrade && apt install -y curl git && \
    curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs && \
    npm i -g typescript

RUN adduser --disabled-password --gecos '' bee && \
    mkdir -p /home/bee/ && \
    chown -R bee:bee /home/bee

USER bee
WORKDIR	/home/bee/
RUN git clone https://github.com/RaboliotTheGrey/POC-Sharp.git && \
    cd POC-Sharp && \
    npm i && \
    npm start node && \
    npm start f-streams