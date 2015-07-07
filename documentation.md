**openFDA Enforcement Mapper Documentation**
---

####**Development**
Requirements:
1. [Node & npm](https://nodejs.org/)
2. [Bower](http://bower.io/)

    git clone https://github.com/blueraster/open-fda-map-viewer.git
    cd open-fda-map-viewer/

Developing server-side:

    cd app/server
    sudo npm install
    npm run build
    npm start


Developing client-side:

    cd app/client
    sudo npm install
    node_modules/.bin/bower install
    npm start

####**Deployment**
Requirements:
 1. [Docker](https://www.docker.com/)

    git clone https://github.com/blueraster/open-fda-map-viewer.git
    docker build -t ofda .
    docker run -p 3000:3000 -d ofda


