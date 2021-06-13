FROM node:13-alpine

RUN mkdir -p /home/app

COPY ./app/package.json /home/app/package.json

COPY ./app /home/app

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# will execute npm install in /home/app because of WORKDIR
RUN npm install

ENV PORT 3003
# RUN npm run build

EXPOSE 3003

# no need for /home/app/server.js because of WORKDIR
CMD ["node", "server.js"]

