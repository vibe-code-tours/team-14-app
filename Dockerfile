# syntax=docker/dockerfile:1

FROM node:24-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npx prisma generate

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs appuser

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

USER appuser

CMD ["npm", "run", "dev"]
