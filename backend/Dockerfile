FROM node:12
COPY package*.json ./
RUN npm install
COPY . .
# todo use the same env var in the code
EXPOSE 8088
ENTRYPOINT ["npm", "run", "start"]