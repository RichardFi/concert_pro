FROM node

RUN mkdir client/app/

COPY public src package.json package-lock.json client/app/

WORKDIR /client/app

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]