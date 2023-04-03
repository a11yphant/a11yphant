FROM node:19.8.1-alpine3.17 as base

FROM base as package-files

WORKDIR /app

COPY package.json /
COPY package-lock.json /
COPY packages/eslint-config/package.json /packages/eslint-config/package.json
COPY packages/eslint-config/*.js  /packages/eslint-config/
COPY services/submission-checker/package* ./

FROM package-files as builder

WORKDIR /app

RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc npm ci

COPY services/submission-checker/tsconfig.json ./
COPY services/submission-checker/tsconfig.build.json ./
COPY services/submission-checker/nest-cli.json ./
COPY services/submission-checker/src ./src

RUN npm run build

FROM package-files as production-dependencies

WORKDIR /app

RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc npm ci --production

FROM base AS release

WORKDIR /app

COPY --from=production-dependencies /app/package* ./
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]
