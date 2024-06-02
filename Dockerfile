FROM node:20.11.0

WORKDIR /app

COPY package.json ./

COPY . .

EXPOSE 3000

RUN npm install

RUN npm run build

CMD [ "npm", "run", "start:prod" ]