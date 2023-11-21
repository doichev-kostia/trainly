FROM node:18.18.2-bookworm as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as builder
RUN apt-get update && apt-get install -y bash jq
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
RUN apt-get update && apt-get install -y bash jq
WORKDIR /app

COPY --from=builder /app/out/full/ .

RUN pnpm install

RUN pnpm run build --filter "@trainly/api"

FROM base as runner
RUN apt-get update && apt-get install -y dumb-init
ENV APP_HOME=/app
WORKDIR $APP_HOME

ENV FASTIFY_CONFIG=$APP_HOME/apps/api/fastify.config.json

COPY --from=installer --chown=node:node /app/apps/api/package.json $APP_HOME
COPY --from=installer --chown=node:node /app/node_modules $APP_HOME/node_modules
COPY --from=installer --chown=node:node /app/apps/api $APP_HOME/apps/api
COPY --from=installer --chown=node:node /app/packages $APP_HOME/packages
COPY --from=installer --chown=node:node /app/apps/api/fastify.config.json $FASTIFY_CONFIG

USER node
EXPOSE 8080

WORKDIR /app/apps/api
ENTRYPOINT ["dumb-init"]
CMD ["./node_modules/.bin/fastify", "start", "./build/app.js"]
