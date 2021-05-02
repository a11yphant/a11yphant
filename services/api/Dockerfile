ARG VERSION=latest

FROM gitlab.mediacube.at:5050/a11yphant/a11yphant/nestjs-aws-messaging:${VERSION} AS nestjs-aws-messaging-package

FROM node:14-alpine as package-files

WORKDIR /services/api

COPY package.json /
COPY package-lock.json /
COPY packages/eslint-config/package.json /packages/eslint-config/package.json
COPY packages/eslint-config/*.js  /packages/eslint-config/
COPY services/api/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=nestjs-aws-messaging-package / /packages/nestjs-aws-messaging/

COPY services/api/package* ./

FROM package-files as builder

WORKDIR /services/api

RUN --mount=type=secret,id=npmrc,dst=/services/api/.npmrc npm ci && rm node_modules/@a11yphant/nestjs-aws-messaging
COPY --from=nestjs-aws-messaging-package / node_modules/@a11yphant/nestjs-aws-messaging/

COPY services/api/tsconfig.json ./
COPY services/api/tsconfig.build.json ./
COPY services/api/nest-cli.json ./
COPY services/api/src ./src

RUN npm run build

FROM package-files as production-dependencies

WORKDIR /services/api

RUN --mount=type=secret,id=npmrc,dst=/services/api/.npmrc npm ci --production && rm node_modules/@a11yphant/nestjs-aws-messaging
COPY --from=nestjs-aws-messaging-package / node_modules/@a11yphant/nestjs-aws-messaging/

FROM node:14-alpine AS release

WORKDIR /app

ENV API_CHALLENGES_LOCATION=/app/challenges

RUN apk add --no-cache curl

COPY --from=production-dependencies /services/api/package* ./
COPY --from=production-dependencies /services/api/node_modules ./node_modules
COPY --from=builder /services/api/nest-cli.json ./
COPY --from=builder /services/api/dist ./dist
COPY services/api/prisma ./prisma
COPY challenges/ ./challenges

CMD ["sh", "-c", "DB_URL=$DATABASE_URL npm run prisma:migrate:prod && npm run console:prod import:challenges"]

FROM node:14-alpine

WORKDIR /app

COPY --from=production-dependencies /services/api/package* ./
COPY --from=production-dependencies /services/api/node_modules ./node_modules
COPY --from=builder /services/api/nest-cli.json ./
COPY --from=builder /services/api/dist ./dist

CMD ["node", "dist/main.js"]

