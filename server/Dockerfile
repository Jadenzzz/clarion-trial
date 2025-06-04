FROM node:20.13.1

WORKDIR /app

COPY package.json ./
COPY . .

RUN npm install
RUN npm run build
RUN rm -rf ./src

EXPOSE 8080
RUN supabase db push
CMD ["npm", "run", "start:prod"]
