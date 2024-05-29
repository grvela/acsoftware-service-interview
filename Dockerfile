FROM node:20.11.0

WORKDIR /app

COPY package.json ./

COPY . .

# TODO - Add run build to prod mode

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]