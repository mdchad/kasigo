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

# Deploy server with its dependencies
RUN pnpm deploy --filter=server --prod /prod/server

# Start a new stage for production
FROM node:20-alpine

# Set up pnpm in production stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy the deployed server with all its dependencies
COPY --from=builder /prod/server ./

# Expose the port your app runs on
EXPOSE 3000

# Start the server application
CMD ["node", "dist/index.js"] 