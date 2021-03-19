#!/bin/sh

# This script is used as a workaround for creating zip files using terraform since
# the terraform archive_file data source cannot handle symlinks.

if [[ "$OSTYPE" == "darwin"* ]]; then
    alias md5sum="md5 -r"
fi

SOURCE_DIR=$(dirname $0)
cd $SOURCE_DIR
zip -rqX lambda.zip \
    dist \
    node_modules \
    nest-cli.json \
    package.json

echo "{ \"hash\": \"$(cat lambda.zip | md5sum | cut -d " " -f 1)\"}"