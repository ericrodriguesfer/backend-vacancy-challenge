FROM node:16.13.2-alpine

WORKDIR /home/api

COPY package.json .
COPY yarn.lock .

RUN npm install -g npm@8.8.0

COPY . .

CMD npm run start:dev