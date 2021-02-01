#!/bin/sh

if [[ "$OSTYPE" == "darwin"* ]]; then
    alias sha256sum="shasum -a 256"
fi

SOURCE_DIR=$(dirname $0)
cd $SOURCE_DIR
zip -rq lambda.zip \
    node_modules \
    entrypoint.js \
    package.json

echo "{ \"hash\": \"$(cat lambda.zip | sha256sum | cut -d " " -f 1)\"}"