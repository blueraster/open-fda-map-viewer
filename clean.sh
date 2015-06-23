# http://jimhoskins.com/2013/07/27/remove-untagged-docker-images.html
# https://coderwall.com/p/ewk0mq/stop-remove-all-docker-containers

# docker stop all containers
docker stop $(docker ps -a -q)

# remove all stopped containers
docker rm $(docker ps -a -q)

# remove all untagged images
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")
