FROM node:18.17.1-alpine3.17 as base

FROM base as package-files

WORKDIR /app

COPY package.json /
COPY package-lock.json /
COPY packages/eslint-config/package.json /packages/eslint-config/package.json
COPY packages/eslint-config/*.js  /packages/eslint-config/
COPY services/api/prisma/schema.prisma ./prisma/schema.prisma

COPY services/api/package* ./

FROM package-files as builder

WORKDIR /app

RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc npm ci

COPY services/api/tsconfig.json ./
COPY services/api/tsconfig.build.json ./
COPY services/api/nest-cli.json ./
COPY services/api/src ./src
COPY services/api/mail-templates ./mail-templates

RUN npm run build

FROM package-files as production-dependencies

WORKDIR /app

RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc npm ci --production

FROM base

WORKDIR /app

ENV API_CHALLENGES_LOCATION=/app/challenges

COPY --from=production-dependencies /app/package* ./
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/mail-templates ./mail-templates
COPY services/api/prisma ./prisma
COPY challenges/ ./challenges

CMD ["node", "dist/main.js"]
