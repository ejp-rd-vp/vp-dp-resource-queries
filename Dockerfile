FROM node:16.14.0-alpine
WORKDIR /app
COPY ./ ./
RUN npm install
CMD ["node", "./bin/server.js"]
