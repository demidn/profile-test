FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate && pnpm build

FROM node:22-alpine
RUN corepack enable
WORKDIR /app
COPY --from=build /app ./
RUN mkdir -p prisma/data
RUN chmod +x docker/entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/app/docker/entrypoint.sh"]
