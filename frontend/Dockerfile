# ----------------------------------------------------
# Development build — Yarn 4 + Node 20
# ----------------------------------------------------
FROM node:20-alpine
WORKDIR /app

RUN corepack enable

# Copy package files (from repo root)
COPY frontend/package.json frontend/yarn.lock ./

RUN yarn install --immutable

# Copy the rest of the frontend (from repo root)
COPY frontend/ ./

# Railway requires $PORT
CMD ["sh", "-c", "yarn dev --host 0.0.0.0 --port $PORT"]
# ----------------------------------------------------
# Development build — Yarn 4 + Node 20
# ----------------------------------------------------
FROM node:20-alpine
WORKDIR /app

RUN corepack enable

# Copy package files (from repo root)
COPY frontend/package.json frontend/yarn.lock ./

RUN yarn install --immutable

# Copy the rest of the frontend (from repo root)
COPY frontend/ ./

# Railway requires $PORT
CMD ["sh", "-c", "yarn dev --host 0.0.0.0 --port $PORT"]
