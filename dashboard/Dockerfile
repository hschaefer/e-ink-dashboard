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
FROM node:20-alpine
WORKDIR /app

# Copy package.json to install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy server code
COPY server.js .

# Copy build outputs from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port (configured to 3000 to align with cloud integrations and environment guidelines)
EXPOSE 3000

CMD ["npm", "start"]
