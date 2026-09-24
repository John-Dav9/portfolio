# Build context: repository root (the seed content comes from src/data and src/locales).
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production DATA_DIR=/data SEED_DIR=/app/seed PORT=3001
COPY server/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server/src ./src
COPY server/scripts ./scripts
COPY src/data ./seed/data
COPY src/locales ./seed/locales
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:3001/api/health || exit 1
CMD ["node", "src/index.js"]
