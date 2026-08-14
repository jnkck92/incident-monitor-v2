# ---- Build Stage ----
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

WORKDIR /app

ARG VITE_DIVERA_API_KEY
ENV VITE_DIVERA_API_KEY=$VITE_DIVERA_API_KEY

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM --platform=linux/arm64 nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80