FROM debian
MAINTAINER Raboliot <raboliot@raboland.fr>

# Install build dependencies
RUN 	apt-get update && \
        apt-get upgrade -y && \
        apt-get install -y git curl build-essential pkg-config ibglib2.0-dev libgirepository1.0-dev libexpat1-dev automake gtk-doc-tools swig libtool

RUN     curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
        apt-get install -y nodejs && \
        npm i -g typescript

# Install lib dependencies
RUN 	apt-get install -y libjpeg62-turbo libexif-dev libgif-dev librsvg2-2 libtiff5-dev libpng-dev libwebp-dev imagemagick libmagick++-6.q16-dev

# Setup user
RUN 	adduser --disabled-password --gecos '' bee && \
        mkdir -p /home/bee/compilation && \
        chown -R bee:bee /home/bee

# Compilation time
USER bee
WORKDIR	/home/bee/compilation
RUN 	git clone https://github.com/libvips/libvips.git

WORKDIR /home/bee/compilation/libvips
RUN 	git checkout 8.7 && \
        pwd && ls && \
        ./autogen.sh && \
        ./configure --with-magickpackage=ImageMagick && \
        make
USER	root
RUN     make install && ldconfig

USER bee
WORKDIR	/home/bee/
RUN git clone https://github.com/RaboliotTheGrey/POC-Sharp.git && \
    cd POC-Sharp && \
    npm i && \
    npm start node && \
    npm start f-streams
