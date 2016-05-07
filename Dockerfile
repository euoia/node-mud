FROM mhart/alpine-node:6

WORKDIR /src
ADD . .

RUN npm install

EXPOSE 4000
CMD ["npm", "start"]
