# DEV STAGE
FROM node:20-alpine AS dev

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

RUN npm config set fetch-timeout 600000 && \
    npm config set registry https://registry.npmjs.org/


COPY package.json package-lock.json ./

RUN npm ci --no-audit --maxsockets 1

COPY . .

RUN npm run client-generate

CMD ["npm", "run", "start:dev"]



# PROD STAGE
FROM node:20-alpine AS prod

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

RUN npm config set fetch-timeout 600000 && \
    npm config set registry https://registry.npmjs.org/

COPY package.json package-lock.json ./

RUN npm ci --no-audit --production --maxsockets 1

COPY . .

RUN npm run client-generate

RUN npm run build

CMD ["npm", "run", "start:prod"]
