FROM node:20.13.1   

WORKDIR /app

COPY package.json .

COPY . .

EXPOSE 3000

RUN npm install

RUN npm run build

RUN rm -rf ./src

EXPOSE 3000

CMD ["npm", "run", "start:prod"]