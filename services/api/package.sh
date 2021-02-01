#!/bin/sh

# This script is used as a workaround for creating zip files using terraform since
# the terraform archive_file data source cannot handle symlinks.

if [[ "$OSTYPE" == "darwin"* ]]; then
    alias sha256sum="shasum -a 256"
fi

SOURCE_DIR=$(dirname $0)
cd $SOURCE_DIR
zip -rqX lambda.zip \
    dist \
    node_modules \
    entrypoint.js \
    nest-cli.json \
    package.json

echo "{ \"hash\": \"$(cat lambda.zip | sha256sum | cut -d " " -f 1)\"}"