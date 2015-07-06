FROM node:0.12
EXPOSE 3000
ADD . open-fda-map-viewer

WORKDIR open-fda-map-viewer/app/client
RUN cp -R dist ../server/public

WORKDIR open-fda-map-viewer/app/server
RUN npm install
RUN npm start
