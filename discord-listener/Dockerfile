FROM node:slim

COPY . /app

WORKDIR /app

RUN npm install

RUN npm install --save-dev ts-node

CMD ["npm", "run", "app"]