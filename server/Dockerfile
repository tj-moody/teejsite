# Start with a Go base image
FROM golang:1.20-alpine as builder

# Set the current working directory inside the container
WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

# Copy the rest of the backend code to the container
COPY . .

# Build the Go app
RUN go build -o server .

# Start with a smaller image for the final stage (reduces image size)
FROM alpine:latest

# Set the working directory
WORKDIR /root/

# Copy the compiled Go binary from the builder image
COPY --from=builder /app .

# Expose the port your app will run on
EXPOSE 8080

# Define the command to run your Go app
CMD ["./server"]
