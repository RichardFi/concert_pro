FROM ubuntu

MAINTAINER richardpan

RUN apt-get update && apt-get -y install nodejs npm

COPY app.js package.json package-lock.json routes client/app/

RUN npm install

EXPOSE 3001

# You can change this
CMD [ "npm", "start" ]