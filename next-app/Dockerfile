
# Dockerfile

# base image
FROM node:13-alpine

# create & set working directory
RUN mkdir -p /home/app
WORKDIR /home/app

# copy source files
COPY ./app /home/app

# install dependencies
RUN npm install

# start app
RUN npm run build
EXPOSE 3000
CMD npm run start

