#!/bin/bash

# For this script to work, you must set the env variables:
#   AWS_ACCESS_KEY_ID
#   AWS_SECRET_ACCESS_KEY
#   S3_BUCKET_NAME

DUMP_DIR=db-backup
DUMP_FILE=backup-content-$(date +%Y-%m-%d).dump

if test -f "$DUMP_DIR/$DUMP_FILE"; then
    echo "Dump file already exists. Skipping download."
else
    echo "Downloading dump file from S3..."

    docker run --rm \
      -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
      -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
      -v $(pwd)/$DUMP_DIR:/data \
      amazon/aws-cli:latest \
      s3 cp s3://$S3_BUCKET_NAME/$DUMP_FILE /data/$DUMP_FILE
fi

echo "Loading dump file into database..."

psql $DB_URL -c 'TRUNCATE TABLE challenges, rules CASCADE';
echo "Truncated challenges"
pg_restore -d $DB_URL $(pwd)/$DUMP_DIR/$DUMP_FILE
echo "Imported challenges"