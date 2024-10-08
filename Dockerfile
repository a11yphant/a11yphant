FROM node:20.10.0-alpine3.17 as base

FROM base as package-files

WORKDIR /app

COPY services/site/package* ./

FROM package-files as builder

WORKDIR /app

RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc npm ci

COPY .prettierrc ./
COPY services/site/public ./public
COPY services/site/src ./src
COPY services/site/.eslintrc.json ./
COPY services/site/codegen.yml ./
COPY services/site/next-env.d.ts ./
COPY services/site/next.config.js ./
COPY services/site/postcss.config.js ./
COPY services/site/tailwind.config.js ./
COPY services/site/tsconfig.json ./

RUN npm run schema:generate

RUN npm run build

FROM package-files as production-dependencies

WORKDIR /app

RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc npm ci --production

FROM base

ENV SITE_PORT=3001

WORKDIR /app

COPY --from=production-dependencies /app/package* ./
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE ${SITE_PORT}

CMD ["npm", "start"]
