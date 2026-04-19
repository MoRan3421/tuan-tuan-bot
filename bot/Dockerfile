FROM node:22-slim

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# Environment variables will be handled by Cloud Run / GCE
ENV NODE_ENV=production

# Expose health check port
EXPOSE 8080

CMD ["node", "index.js"]
