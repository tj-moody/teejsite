FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create mount target directory (optional)
RUN mkdir -p /usr/share/nginx/html

# Expose Nginx port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
