# Production Dockerfile for Next.js Portfolio
# Based on official Next.js Docker patterns with security and optimization improvements

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install necessary system dependencies
RUN apk add --no-cache ca-certificates bash openssl git

# Copy package files
COPY package*.json ./

# Install production dependencies (smaller footprint)
RUN npm ci --only=production

# Stage 2: Builder with output='standalone'
FROM node:18-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache ca-certificates bash

# Copy all package files and configuration
COPY package*.json package-lock.json* .npmrc* ./
COPY next.config.js .nextrc* ./

# Copy source code
COPY . .

# Build-time environment variables
ARG GITHUB_USERNAME
ARG GITHUB_TOKEN
ENV GITHUB_USERNAME=${GITHUB_USERNAME}
ENV GITHUB_TOKEN=${GITHUB_TOKEN}
ENV NEXT_TELEMETRY_DISABLED=1

# Optimize build
RUN npm ci --only=production

# Enable standalone output for better container isolation
RUN npm run build

# Stage 3: Production runner
FROM node:18-alpine AS production
WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache ca-certificates dumb-init

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set proper ownership and permissions
RUN chown -R nextjs:nodejs /app
RUN chmod -R 755 /app && chmod -R 644 /app/public

# Switch to non-root user
USER nextjs

# Application configuration
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

# Expose application port
EXPOSE 3000

# Health check endpoint for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    });
    
    req.on('error', (err) => {
      process.exit(1);
    });
    
    req.on('timeout', () => {
      req.destroy();
      process.exit(1);
    });
    
    req.end();
  "

# Use dumb-init for proper signal handling and process management
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
