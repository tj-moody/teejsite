FROM node:18-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY . .

# Expose Nginx port
EXPOSE 3000

CMD ["npm", "run", "dev"]
