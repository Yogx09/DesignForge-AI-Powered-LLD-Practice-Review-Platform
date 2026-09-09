# Multi-stage Docker build for CipherLLD Practice Platform
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package manifests
COPY package.json package-lock.json* ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/

# Install dependencies
RUN npm install
RUN npm --prefix backend install
RUN npm --prefix frontend install

# Copy source files
COPY . .

# Build frontend and backend
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/RESEARCH_NOTE.md ./
COPY --from=builder /app/DESIGN_NOTE.md ./
COPY --from=builder /app/AI_USAGE.md ./
COPY --from=builder /app/package.json ./

EXPOSE 4000

CMD ["node", "backend/dist/server.js"]
