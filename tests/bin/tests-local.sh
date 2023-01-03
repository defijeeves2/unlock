#!/usr/bin/env bash
set -e

REPO_ROOT=`pwd`/`dirname "$0"`/../..
echo "running from: $REPO_ROOT"
BASE_DOCKER_FOLDER=$REPO_ROOT/docker
BASE_DOCKER_COMPOSE=$BASE_DOCKER_FOLDER/docker-compose.yml
DOCKER_COMPOSE_FILE=$BASE_DOCKER_FOLDER/docker-compose.integration.yml

COMPOSE_CONFIG="-f $BASE_DOCKER_COMPOSE -f $DOCKER_COMPOSE_FILE"

# Setting the right env var
export UNLOCK_ENV=test

# clean things up 
docker-compose $COMPOSE_CONFIG down

# Take db, IPFS, graph and postgres nodes up
docker-compose $COMPOSE_CONFIG up -d postgres ipfs graph-node eth-node

# # deploy contracts
cd $REPO_ROOT/docker/development/eth-node
yarn
yarn provision --network localhost

# copy the generated subgraph config file
rm -rf $REPO_ROOT/subgraph/networks.json 
cp $REPO_ROOT/docker/development/eth-node/networks.json $REPO_ROOT/subgraph/networks.json

# prepare subgraph deployment
cd $REPO_ROOT/subgraph
yarn prepare:abis
yarn codegen
yarn graph build --network localhost

# now deploy the subgraph
yarn workspace @unlock-protocol/subgraph run graph create testgraph --node http://localhost:8020/ --version 0.0.1
yarn graph deploy testgraph --node http://localhost:8020/ --ipfs http://localhost:5001 --version-label 0.0.1 --network localhost