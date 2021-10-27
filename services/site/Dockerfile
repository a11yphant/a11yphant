FROM public.ecr.aws/lambda/nodejs:14 as package-files

ARG SPLITBEE_TOKEN

WORKDIR /app

COPY services/site/package* ./

FROM package-files as builder

WORKDIR /app
ENV NEXT_PUBLIC_SITE_SPLITBEE_TOKEN=${SPLITBEE_TOKEN}

RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc npm ci

COPY .prettierrc ./
COPY services/site/public ./public
COPY services/site/src ./src
COPY services/site/.babelrc ./
COPY services/site/.eslintrc.json ./
COPY services/site/codegen.yml ./
COPY services/site/entrypoint.js ./
COPY services/site/next-env.d.ts ./
COPY services/site/postcss.config.js ./
COPY services/site/tailwind.config.js ./
COPY services/site/tsconfig.json ./
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
COPY --from=builder /app/entrypoint.js ./entrypoint.js

CMD ["entrypoint.handler"]