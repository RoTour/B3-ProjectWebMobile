FROM webmob-base:latest AS builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
RUN npx nx build admin-panel ${BUILD_FLAG}

FROM nginx:1.19.2

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/builder/dist/apps/admin-panel ./
COPY --from=builder /app/builder/apps/admin-panel/nginx.conf /etc/nginx/nginx.conf
