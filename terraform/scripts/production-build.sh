#!/bin/bash

shopt -s expand_aliases

cd $(dirname $0)
cd ../..
alias aws-npm="docker run --rm -v\"$(pwd)/:/app\" -w=\"/app\" --entrypoint=\"\" public.ecr.aws/lambda/nodejs:12 npm"

npm ci --ignore-scripts

npm install --prefix packages/prisma
npm run prisma:generate --prefix packages/prisma
npm run build --prefix packages/prisma
rm -rf packages/prisma/node_modules

rm -f services/api/lambda.zip
npm install --prefix services/api
npm run build --prefix services/api
aws-npm ci --only=production --prefix services/api

rm -f services/database-migration/lambda.zip
aws-npm ci --only=production --prefix services/database-migration

rm -f services/import-challenges/lambda.zip
npm install --prefix services/import-challenges
npm run build --prefix services/import-challenges
aws-npm ci --only=production --prefix services/import-challenges
rm -rf packages/prisma/node_modules

rm -f services/site/lambda.zip
rm -rf services/site/.next
npm install --prefix services/site
npm run build --prefix services/site
aws-npm ci --only=production --prefix services/site
