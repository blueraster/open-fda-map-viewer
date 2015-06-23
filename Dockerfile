FROM node:0.12
EXPOSE 3000
ADD . open-fda-map-viewer
WORKDIR open-fda-map-viewer/app
RUN ls
RUN npm install
CMD npm start
