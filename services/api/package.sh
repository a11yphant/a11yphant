#!/bin/sh

# This script is used as a workaround for creating zip files using terraform since
# the terraform archive_file data source cannot handle symlinks.
SOURCE_DIR=$(dirname $0)
cd $SOURCE_DIR
zip -rq lambda.zip \
    dist \
    node_modules \
    entrypoint.js \
    nest-cli.json \
    package.json

echo "{ \"hash\": \"$(cat lambda.zip | shasum -a 256 | cut -d " " -f 1 | xxd -r -p | base64)\"}"