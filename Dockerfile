FROM node:18

# Install MySQL client
RUN apt-get update && apt-get install -y default-mysql-client

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]