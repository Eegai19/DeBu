# Build from the repository root:  docker build -f server/Dockerfile -t debu-api .
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci --workspace server --include-workspace-root=false
COPY shared shared
COPY server server
RUN npm run build -w server

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci --workspace server --omit=dev --include-workspace-root=false && npm cache clean --force
COPY shared shared
COPY --from=build /app/server/dist server/dist
USER node
EXPOSE 5000
CMD ["node", "server/dist/index.js"]
