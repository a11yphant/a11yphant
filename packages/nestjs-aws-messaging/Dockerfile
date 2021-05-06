FROM node:14-alpine as builder

WORKDIR /packages/nestjs-aws-messaging

COPY packages/eslint-config/package.json /packages/eslint-config/package.json
COPY packages/eslint-config/*.js  /packages/eslint-config/
COPY packages/nestjs-aws-messaging/tsconfig.json ./
COPY packages/nestjs-aws-messaging/tsconfig.build.json ./

COPY packages/nestjs-aws-messaging/package* ./

RUN --mount=type=secret,id=npmrc,dst=/packages/nestjs-aws-messaging/.npmrc npm ci

COPY packages/nestjs-aws-messaging/lib ./lib

RUN npm run build

FROM scratch

WORKDIR /

COPY --from=builder /packages/nestjs-aws-messaging/package.json ./
COPY --from=builder /packages/nestjs-aws-messaging/dist ./dist
