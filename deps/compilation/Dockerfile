FROM debian
MAINTAINER Raboliot <raboliot@raboland.fr>

# Install build dependencies
RUN 	apt-get update && \
	apt-get upgrade -y && \
	apt-get install -y build-essential pkg-config libglib2.0-dev libexpat1-dev apt-utils

# Install lib dependencies
RUN 	apt-get install -y libjpeg62-turbo libexif-dev libgif-dev librsvg2-2 libtiff5-dev libpng-dev libwebp-dev imagemagick

# Setup user
RUN 	adduser --disabled-password --gecos '' bee && \
 	mkdir -p /home/bee/compilation && \
	chown -R bee:bee /home/bee

# Compilation time
WORKDIR	/home/bee/compilation
COPY 	--chown=bee ../libvips .

USER 	bee
RUN 	./configure \
	--with-magickpackage=ImageMagick && \
	make
