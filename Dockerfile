# Use the official Node.js image
FROM node:20-alpine as builder

# Set up pnpm using corepack (official recommended way)
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set working directory to root
WORKDIR /app

# Copy package files for the server only
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/

# Install dependencies for the entire workspace
RUN pnpm install --frozen-lockfile

# Copy the entire monorepo structure
COPY . .

# Build only the server application
RUN cd apps/server && pnpm run build

# Start a new stage for production
FROM node:20-alpine

# Set up pnpm in production stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy server files and lockfile
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json
COPY --from=builder /app/apps/server/start.sh ./start.sh
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies
RUN pnpm install --prod

# Expose the port your app runs on
EXPOSE 3000

# Make the startup script executable and start the server application with migrations
RUN chmod +x start.sh
CMD ["./start.sh"] 