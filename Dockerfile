# syntax=docker/dockerfile:1

FROM node:24-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npx prisma generate

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Dev Dockerfile runs as root because docker-compose volume mounts
# (.:/app, /app/.next) require root ownership for hot-reload writes.
# Production should use a separate Dockerfile with a non-root USER.
# nosemgrep: dockerfile.security.missing-user.missing-user
CMD ["npm", "run", "dev"]
