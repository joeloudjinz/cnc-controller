#node version: carbon
#app version: 1.0.0

FROM node:11.8.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# copy from the roor directory of the project to the image work dir
COPY . .

EXPOSE 8080