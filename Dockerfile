FROM node
# ADD . {project dir}
# WORKDIR {/project dir/app code}
RUN npm install
CMD npm start
