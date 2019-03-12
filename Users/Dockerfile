FROM node:10.15-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 8000
ENV TEAM_ID=CC_61_69_74_82
CMD [ "node", "server.js" ]
