#!/bin/sh

if [[ "$OSTYPE" == "darwin"* ]]; then
    alias md5sum="md5 -r"
fi

SOURCE_DIR=$(dirname $0)
cd $SOURCE_DIR
zip -rqX lambda.zip \
    node_modules \
    dist \
    entrypoint.js \
    package.json

echo "{ \"hash\": \"$(cat lambda.zip | md5sum | cut -d " " -f 1)\"}"