FROM node:latest
WORKDIR /tickUrTime/backend
COPY . .
RUN npm install
EXPOSE 8080
ENTRYPOINT ["npm","start"]
