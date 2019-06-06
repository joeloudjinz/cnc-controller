#node version: carbon
#app version: 1.0.0

FROM node:11.8.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# copy from the root directory of the project to the image work dir
COPY . .

EXPOSE 8080

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm start