FROM node:8

WORKDIR /test

COPY test /test

RUN npm init -y
RUN npm install -g mocha
RUN npm install --save-dev should supertest

CMD ["mocha"]