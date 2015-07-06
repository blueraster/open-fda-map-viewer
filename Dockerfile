FROM node:0.12
EXPOSE 3000
ADD . open-fda-map-viewer

# client build
WORKDIR /open-fda-map-viewer/app/client
RUN npm install
RUN node_modules/.bin/bower install --allow-root
RUN npm run dist
RUN cp -R dist/* ../server/public

# server build
WORKDIR /open-fda-map-viewer/app/server
RUN npm install
RUN npm run build

CMD npm start
