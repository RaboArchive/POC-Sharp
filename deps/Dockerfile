FROM debian
MAINTAINER Raboliot <raboliot@raboland.fr>

# Install build dependencies
RUN 	apt-get update && \
	apt-get upgrade -y && \
	apt-get install -y build-essential pkg-config ibglib2.0-dev libgirepository1.0-dev libexpat1-dev git automake gtk-doc-tools swig libtool

# Install lib dependencies
RUN 	apt-get install -y libjpeg62-turbo libexif-dev libgif-dev librsvg2-2 libtiff5-dev libpng-dev libwebp-dev imagemagick

# Setup user
RUN 	adduser --disabled-password --gecos '' bee && \
 	mkdir -p /home/bee/compilation && \
	chown -R bee:bee /home/bee

# Compilation time
WORKDIR	/home/bee/compilation
RUN 	git clone https://github.com/libvips/libvips.git 


#USER 	bee
WORKDIR /home/bee/compilation/libvips
RUN 	pwd && ls && \
	./autogen.sh && \
	./configure \
	--with-magickpackage=ImageMagick && \
	make
