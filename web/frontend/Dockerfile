FROM node:alpine

ARG WEBSOCKET_PORT=8080
ENV WEBSOCKET_PORT=${WEBSOCKET_PORT}

ARG WEBSOCKET_HOST=localhost
ENV WEBSOCKET_HOST=${WEBSOCKET_HOST}

WORKDIR /home/node

COPY . .

RUN echo $'WEBSOCKET_PORT='${WEBSOCKET_PORT}$'\n\
    WEBSOCKET_HOST='${WEBSOCKET_HOST}$'' >> .env && \
    npm install && \
    npm install pm2 -g && \
    npm run build

CMD ["pm2-runtime", "start", "config/ecosystem.config.js"]