FROM golang:1.22.1-alpine
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN go build -o main .
EXPOSE 3001:3001
ENTRYPOINT ["/app/main"]