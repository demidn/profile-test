#!/bin/sh
set -e
mkdir -p prisma/data
pnpm prisma migrate deploy
pnpm prisma db seed
exec node dist/main.js
