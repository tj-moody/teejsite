FROM oven/bun:latest AS builder

WORKDIR /app
COPY package*.json ./

RUN bun install

COPY . .

RUN bun run build

WORKDIR /app

CMD ["tsc", "-p", "frontend/"],

FROM nginx:alpine
copy --from=builder /app/dist /usr/share/nginx/html

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
