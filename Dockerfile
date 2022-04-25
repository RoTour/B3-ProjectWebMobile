FROM node:lts-alpine3.10 as webmob-builder
ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .

RUN apk add python3 make g++
RUN npm i
