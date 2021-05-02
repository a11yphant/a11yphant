ARG VERSION=latest

FROM gitlab.mediacube.at:5050/a11yphant/a11yphant/nestjs-aws-messaging:${VERSION} AS nestjs-aws-messaging-package

FROM public.ecr.aws/lambda/nodejs:14 as package-files

WORKDIR /services/submission-checker

COPY package.json /
COPY package-lock.json /
COPY packages/eslint-config/package.json /packages/eslint-config/package.json
COPY packages/eslint-config/*.js  /packages/eslint-config/
COPY services/submission-checker/package* ./
COPY --from=nestjs-aws-messaging-package / /packages/nestjs-aws-messaging/
COPY services/submission-checker/package* ./

FROM package-files as builder

WORKDIR /services/submission-checker

RUN --mount=type=secret,id=npmrc,dst=/packages/nestjs-aws-messaging/.npmrc npm ci && rm node_modules/@a11yphant/nestjs-aws-messaging
COPY --from=nestjs-aws-messaging-package / node_modules/@a11yphant/nestjs-aws-messaging/

COPY services/submission-checker/tsconfig.json ./
COPY services/submission-checker/tsconfig.build.json ./
COPY services/submission-checker/nest-cli.json ./
COPY services/submission-checker/src ./src

RUN npm run build

FROM package-files as production-dependencies

WORKDIR /services/submission-checker

RUN --mount=type=secret,id=npmrc,dst=/packages/nestjs-aws-messaging/.npmrc npm ci --production && rm node_modules/@a11yphant/nestjs-aws-messaging
COPY --from=nestjs-aws-messaging-package / node_modules/@a11yphant/nestjs-aws-messaging/

FROM public.ecr.aws/lambda/nodejs:14

WORKDIR /var/task

RUN yum install unzip -y

RUN curl https://intoli.com/install-google-chrome.sh | bash \
    && mv /usr/bin/google-chrome-stable /usr/bin/google-chrome

RUN wget https://chromedriver.storage.googleapis.com/$(curl https://chromedriver.storage.googleapis.com/LATEST_RELEASE)/chromedriver_linux64.zip \
    && unzip chromedriver_linux64.zip \
    && mv chromedriver /usr/bin/chromedriver \
    && rm chromedriver_linux64.zip

COPY --from=production-dependencies /services/submission-checker/package* ./
COPY --from=production-dependencies /services/submission-checker/node_modules ./node_modules
COPY --from=builder /services/submission-checker/nest-cli.json ./
COPY --from=builder /services/submission-checker/dist ./dist

CMD ["dist/main.handle"]

