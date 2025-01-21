FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine as production
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=3000
# Add this line
ENV HOST=0.0.0.0

CMD ["sh", "-c", "NODE_ENV=production REMIX_DEV_ORIGIN=http://${HOST}:${PORT} npm run start"]