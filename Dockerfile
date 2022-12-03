FROM node:16

WORKDIR /app/src/

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8350

CMD ["npm","start"]