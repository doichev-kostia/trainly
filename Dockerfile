FROM node:18.18.2-bookworm as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update && apt-get install -y bash jq curl

FROM base as builder
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY turbo.json ./

RUN pnpm add -g turbo

COPY ./apps/api ./apps/api
COPY ./packages ./packages

RUN turbo prune "@trainly/api" --docker

FROM base as installer
WORKDIR /app

COPY --from=builder /app/out/full/ .

RUN pnpm install

RUN pnpm run build --filter "@trainly/api"

FROM base as runner
RUN apt-get update && apt-get install -y dumb-init
ENV HOME=/home/app
ENV APP_HOME=/trainly
ENV API_DIR=$APP_HOME/apps/api
WORKDIR $APP_HOME

ENV APP_CONFIG=$API_DIR/app-config.json5
ENV GOOGLE_APPLICATION_CREDENTIALS=$API_DIR/service-account.json

COPY --from=installer --chown=node:node /app/apps/api/package.json $APP_HOME
COPY --from=installer --chown=node:node /app/node_modules $APP_HOME/node_modules
COPY --from=installer --chown=node:node /app/apps/api $API_DIR
COPY --from=installer --chown=node:node /app/packages $APP_HOME/packages
COPY --from=installer --chown=node:node /app/apps/api/app-config.json5 $FASTIFY_CONFIG
COPY --from=installer --chown=node:node /app/apps/api/service-account.json $GOOGLE_APPLICATION_CREDENTIALS

USER node
EXPOSE 8080

WORKDIR $API_DIR
ENTRYPOINT ["dumb-init"]
CMD ["node", "./build/server.js"]
