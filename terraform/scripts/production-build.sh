#!/bin/bash

shopt -s expand_aliases

cd $(dirname $0)
cd ../..
alias aws-npm="docker run --rm -v\"$(pwd)/:/app\" -w=\"/app\" --entrypoint=\"\" public.ecr.aws/lambda/nodejs:12 npm"

npm ci --ignore-scripts

rm -f services/api/lambda.zip
npm ci --prefix services/api
npm run build --prefix services/api
aws-npm ci --only=production --prefix services/api --cache .npm --prefer-offline

rm -f services/site/lambda.zip
rm -rf services/site/.next
npm ci --prefix services/site
npm run build --prefix services/site
npm ci --only=production --prefix services/site

rm -f services/submission-checker/lambda.zip
npm ci --prefix services/submission-checker
npm run build --prefix services/submission-checker
npm ci --only=production --prefix services/submission-checker
