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
RUN git config --global --add safe.directory /app \
    && make server

# Start a new stage from scratch
FROM scratch AS runner

# Copy the necessary libraries from the builder stage
COPY --from=builder /lib/ld-musl-x86_64.so.1 /lib/ld-musl-x86_64.so.1
COPY --from=builder /usr/lib/libstdc++.so.6 /usr/lib/libstdc++.so.6
COPY --from=builder /usr/lib/libgcc_s.so.1 /usr/lib/libgcc_s.so.1

# Copy the built application from the builder stage
COPY --from=builder /app/bin/gmessage /gmessage

# Run the binary
ENTRYPOINT ["/gmessage"]