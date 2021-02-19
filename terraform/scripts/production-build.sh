#!/bin/bash

cd $(dirname $0)
cd ../..

npm install --prefix packages/prisma
npm run build --prefix packages/prisma
rm -rf packages/prisma/node_modules

npm install --prefix services/api
npm run build --prefix services/api
npm ci --only=production --prefix services/api

docker run --rm -v="$(pwd)/services/database-migration:/app" -w="/app" --entrypoint="" public.ecr.aws/lambda/nodejs:12 npm ci --only=production

npm install --prefix services/import-challenges
npm run build --prefix services/import-challenges
docker run --rm -v="$(pwd):/app" -w="/app" --entrypoint="" public.ecr.aws/lambda/nodejs:12 npm ci --only=production --prefix services/import-challenges
rm -rf packages/prisma/node_modules

npm install --prefix services/site
npm run build --prefix services/site
npm ci --only=production --prefix services/site
