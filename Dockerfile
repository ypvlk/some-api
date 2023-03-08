FROM node:16.13.1-alpine3.15
RUN apk update && apk upgrade

WORKDIR /app
RUN apk add python3 make gcc g++
COPY . .
RUN yarn
EXPOSE 3000
CMD yarn start:dev