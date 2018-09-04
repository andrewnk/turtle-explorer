FROM node:alpine

WORKDIR /home/node

COPY . .

RUN npm install && npm install pm2 -g && npm run build

USER node

CMD ["pm2-runtime", "start", "ecosystem.config.js"]