# Use a Go base image: Alpine with Go 1.20.4
FROM golang:1.20.4-alpine as builder

# Set environment variable to prevent prompts from apk
ENV APKARGS="--no-cache"

RUN rm -rf /var/cache/apk/* && \
    rm -rf /tmp/*

RUN apk update 
# Install necessary dependencies
# Note: Alpine uses apk instead of apt-get
RUN apk add ${APKARGS} \
    curl \
    gcc \
    g++ \
    make \
    cmake \
    git \
    xz \
    pkgconfig \
    nodejs \
    npm

# Set up environment variables for Go
ENV GOPATH=/root/go
ENV PATH=$GOPATH/bin:$GOROOT/bin:$PATH

# Install pnpm
RUN npm install -g pnpm \
    && go install github.com/gobuffalo/packr/v2/packr2@latest

# Copy your local files into the docker image
COPY . /app

# Set the working directory
WORKDIR /app

# Build your application without gui
RUN make server

# Start a new stage for running the application
FROM golang:1.20.4-alpine as runner

# Install necessary libraries
RUN apk --no-cache add libstdc++ libgcc

# Create necessary directories
RUN mkdir -p /app/bin

# Copy only the built application and necessary runtime dependencies from the builder stage
COPY --from=builder /app/bin/gmessage /app/bin/gmessage

# Expose the port your application runs on
EXPOSE 10999

# Run the binary
CMD ["/app/bin/gmessage"]