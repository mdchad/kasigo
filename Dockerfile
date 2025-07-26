# Use the official Node.js image
FROM node:20-alpine as builder

# Set working directory to root
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
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

# Install pnpm globally in production
RUN npm install -g pnpm

# Copy the root workspace structure
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-workspace.yaml .

# Copy server files
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json

# Expose the port your app runs on
EXPOSE 3000

# Start the server application
CMD ["pnpm", "run", "start"] 