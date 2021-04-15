FROM node:14-alpine as package-files

WORKDIR /packages/prisma

COPY packages/eslint-config/package.json /packages/eslint-config/package.json
COPY packages/eslint-config/*.js  /packages/eslint-config/

COPY packages/prisma/package* ./

FROM package-files as builder

RUN npm ci

COPY packages/prisma/tsconfig.json ./
COPY packages/prisma/tsconfig.build.json ./
COPY packages/prisma/prisma/schema.prisma ./prisma/schema.prisma

COPY packages/prisma/lib ./lib

RUN npm run prisma:generate
RUN npm run build

FROM package-files as production-dependencies

WORKDIR /packages/prisma

RUN npm ci --production

FROM scratch

WORKDIR /

COPY --from=builder /packages/prisma/package.json ./
COPY --from=builder /packages/prisma/client ./client
COPY --from=builder /packages/prisma/dist ./dist
COPY --from=production-dependencies /packages/prisma/node_modules ./node_modules
COPY packages/prisma/scripts/download-engine.js ./scripts/download-engine.js
