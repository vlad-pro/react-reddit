#!/bin/bash
# A script to start the container for Postgres
# Do not forget to change the directory where you would like to the container to put the files.

docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v /Users/vproskurin/work/js_Projects/learning/react/react-reddit/server/data:/var/lib/postgresql/data  postgres
echo Container Up

# You can use the following scripts to get the directory of the bash script and use 
# it in the docker run command above or use any arbituary link 
# DIR="$(dirname "$(readlink -f "$0")")" # for Linux-based systems
# DIR=$(cd "$(dirname "$0")"; pwd) # for macos
