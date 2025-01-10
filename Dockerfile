# FROM node:16.14.0-alpine
FROM node
# FROM node:20.9.0
# LABEL repository="tasker2-backend"

# RUN node -v


# USER node 

# RUN mkdir -p /home/node/app 

ARG DATABASE_URL

WORKDIR /home/node/app 

# COPY --chown=node .npmrc ./
# COPY .npmrc ./
# COPY --chown=node package*.json ./
# COPY package*.json ./

# RUN npm ci

# COPY --chown=node . .
COPY . .

ENV DATABASE_URL=${DATABASE_URL}

RUN npm config set fetch-timeout 60000000
# RUN npm config set timeout 600000
# RUN npm cache clean --force

RUN npm cache clean --force && \
    npm install -g npm@latest && \
    npm install

# RUN npm install

# Kasowanie bazy i tworzenie wszystkiego od nowa
# RUN npm run migrate-reset-force

# Aktualizacja bazy
# RUN npm run migrate-exists
# RUN npm run seed

RUN npm run client-generate
RUN npm run migrate-reset

RUN npm run build

# ENV HOST=0.0.0.0 BACKEND_PORT=3000

EXPOSE 3000
# EXPOSE ${BACKEND_PORT}
CMD [ "npm", "run", "start" ]
