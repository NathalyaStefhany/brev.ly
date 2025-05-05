FROM node:20.18 AS base

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=base /usr/src/app/node_modules ./node_modules

RUN pnpm run build
RUN pnpm prune --prod

FROM gcr.io/distroless/nodejs20-debian12 AS deploy

USER 1000

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3333

CMD ["dist/infra/http/server.js"]