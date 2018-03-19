FROM node:8.10.0-alpine

COPY . /app/

WORKDIR /app

CMD ["node", "production.js"]