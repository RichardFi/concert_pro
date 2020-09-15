FROM ubuntu

MAINTAINER richardpan

ENV DEBIAN_FRONTEND=nonintercative

RUN apt-get update && apt-get -y install nodejs npm

COPY client app/concert_pro/client

COPY server app/concert_pro/server

WORKDIR /app/concert_pro/client

RUN npm install

WORKDIR /app/concert_pro/server

RUN npm install

EXPOSE 3001

# You can change this
CMD [ "npm", "start" ]