FROM golang:alpine as builder

ARG DB_USER=go
ENV DB_USER=${DB_USER}

ARG DB_NAME=trtl
ENV DB_NAME=${DB_NAME}

ARG DB_PASSWORD=98765
ENV DB_PASSWORD=${DB_PASSWORD}

ARG DB_HOST=db-nodes-and-pools
ENV DB_HOST=${DB_HOST}

ARG DB_PORT=5432
ENV DB_PORT=${DB_PORT}

ARG DB_SSLMODE=disable
ENV DB_SSLMODE=${DB_SSLMODE}

COPY main.go /go
COPY ./wait-for-postgres.sh /go

WORKDIR /go

RUN apk add --no-cache git postgresql-client && \
    go get github.com/lib/pq && \
    go get github.com/robfig/cron && \
    CGO_ENABLED=0 go build -a --installsuffix cgo --ldflags="-s" -o service-nodes-and-pools && \
    chmod +x wait-for-postgres.sh

CMD ./wait-for-postgres.sh ${DB_HOST} ${DB_PORT} ${DB_USER} ${DB_PASSWORD} ${DB_NAME} ./service-nodes-and-pools -db-user=${DB_USER} -db-name=${DB_NAME} -db-password=${DB_PASSWORD} -db-host=${DB_HOST} -db-port=${DB_PORT} -db-ssl-mode=${DB_SSLMODE}