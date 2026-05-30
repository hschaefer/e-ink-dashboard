# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifest files
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies for compilation
RUN npm ci

# Copy the rest of the source code
COPY . .

# Compile the production assets
RUN npm run build

# Stage 2: Run-time server environment
FROM nginx:alpine

# Copy custom nginx configuration for client-side routing and optimized caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build outputs from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy configuration generation script to docker-entrypoint.d/ to run on startup
COPY generate-config.sh /docker-entrypoint.d/30-generate-config.sh
RUN chmod +x /docker-entrypoint.d/30-generate-config.sh

# Expose port (configured to 3000 to align with cloud integrations and environment guidelines)
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
