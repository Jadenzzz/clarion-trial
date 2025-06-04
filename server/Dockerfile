FROM node:20.13.1   

WORKDIR /app

COPY package.json .

COPY . .


RUN npm install

RUN npm run build

RUN rm -rf ./src


CMD ["npm", "run", "start:prod"]