FROM node:alpine

WORKDIR /home/node

COPY . .

RUN npm install && npm install pm2 -g && npm run build

CMD ["pm2-runtime", "start", "config/ecosystem.config.js"]