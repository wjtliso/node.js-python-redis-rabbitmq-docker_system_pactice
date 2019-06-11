FROM node:8

WORKDIR /app

COPY app /app

RUN npm init -y
RUN npm install --save express amqplib express-fileupload uuid ioredis

CMD ["node", "index.js"]