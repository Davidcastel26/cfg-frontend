# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better cache)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:alpine

# Copy custom Nginx config (optional – see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]