FROM public.ecr.aws/lambda/nodejs:14 as package-files

WORKDIR /app

COPY services/site/package* ./

FROM package-files as builder

ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG VERSION

ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}
ENV SITE_VERSION=${VERSION}

WORKDIR /app

RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc npm ci

COPY .prettierrc ./
COPY services/site/public ./public
COPY services/site/src ./src
COPY services/site/.eslintrc.json ./
COPY services/site/codegen.yml ./
COPY services/site/server.js ./
COPY services/site/entrypoint.js ./
COPY services/site/entrypoint-server.js ./
COPY services/site/next-env.d.ts ./
COPY services/site/next.config.js ./
COPY services/site/postcss.config.js ./
COPY services/site/tailwind.config.js ./
COPY services/site/tsconfig.json ./
COPY services/site/sentry.client.config.js ./
COPY services/site/sentry.server.config.js ./

COPY services/api/schema.gql /api/schema.gql

RUN npm run build

FROM package-files as production-dependencies

WORKDIR /app

RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc npm ci --production

FROM public.ecr.aws/lambda/nodejs:14

WORKDIR /var/task

COPY --from=production-dependencies /app/package* ./
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/entrypoint.js ./entrypoint.js
COPY --from=builder /app/entrypoint-server.js ./entrypoint-server.js

CMD ["entrypoint.handler"]