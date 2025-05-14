FROM node:20 AS builder

WORKDIR /app
COPY . .

WORKDIR /app

CMD ["tsc", "-p", "frontend/"],

FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files from builder stage
COPY --from=builder /app/app /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
