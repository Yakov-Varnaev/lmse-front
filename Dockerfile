ARG NODE_VERSION=20.18.0

FROM node:${NODE_VERSION}-slim AS base

ARG PORT=3000

WORKDIR /src

# Build
FROM base AS build

COPY --link ./package.json ./yarn.lock ./
RUN yarn install

COPY --link . .

RUN yarn run build


# Run
FROM base

ENV PORT=$PORT
ENV NODE_ENV=production

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]
