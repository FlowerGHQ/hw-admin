#!/bin/bash

set -e
set -o pipefail

default_context=horwin
context=$default_context

if [[ -n "$1" ]]; then
  context=$1
fi

if [[ "horwin" != *"${context}"* ]];then
    echo "invalid context: $context"
    exit 0
fi

echo "context: $context"

/bin/rm -rf dist/
./node_modules/.bin/vite build --mode $context
/bin/rm -rf container/app/*
/bin/cp -f -R dist/ container/app/

cd container

image_space=$context
if [[ $context != $default_context ]]; then
  image_space=$default_context/$context
fi

image=di.sinfere.com/app/$image_space/eos/admin-fe

docker build --rm -t ${image} .
docker push ${image}

/bin/rm -rf app/*