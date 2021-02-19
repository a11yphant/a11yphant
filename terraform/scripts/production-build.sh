#!/bin/bash

cd $(dirname $0)
cd ../..

npm install --prefix services/api
npm run build --prefix services/api
npm ci --production --prefix services/api

cp -r services/import-challenges/prisma services/database-migration/prisma
docker run --rm -v="$(pwd)/services/database-migration:/app" -w="/app" --entrypoint="" public.ecr.aws/lambda/nodejs:12 npm ci --production
rm -rf services/database-migration/prisma

npm install --prefix services/import-challenges
npm run build --prefix services/import-challenges
docker run --rm -v="$(pwd)/services/import-challenges:/app" -w="/app" --entrypoint="" public.ecr.aws/lambda/nodejs:12 npm ci --production

npm install --prefix services/site
npm run build --prefix services/site
npm ci --production --prefix services/site