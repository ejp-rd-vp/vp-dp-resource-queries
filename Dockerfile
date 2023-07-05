FROM node:16.14.0-alpine
WORKDIR /app
ARG AUTH_SERVER_URL
ENV AUTH_SERVER_URL=${AUTH_SERVER_URL}
ARG AUTH_REALM
ENV AUTH_REALM=${AUTH_REALM}
ARG AUTH_CLIENT_ID
ENV AUTH_CLIENT_ID=${AUTH_CLIENT_ID}
ARG AUTH_KEYS
ENV AUTH_KEYS=${AUTH_KEYS}
COPY ./ ./
RUN npm install
CMD ["node", "./bin/server.js"]
