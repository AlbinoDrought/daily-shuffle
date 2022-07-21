FROM node:18-alpine3.15

RUN addgroup -S application && adduser -S application -G application
USER application
COPY --chown=application:application . /app

WORKDIR /app
RUN npm ci
