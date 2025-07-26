# Use the official Node.js image
FROM node:20-alpine as builder

# Set working directory to root
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files for the entire workspace (needed for building)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/

# Install dependencies for the entire workspace
RUN pnpm install --frozen-lockfile

# Copy the entire monorepo structure
COPY . .

# Build only the server application
RUN cd apps/server && pnpm run build

# Start a new stage for production
FROM node:20-alpine

WORKDIR /app

# Copy only the server's built files and dependencies
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your app runs on
EXPOSE 3000

# Start the server application
CMD ["node", "dist/index.js"] 