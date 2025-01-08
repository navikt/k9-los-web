FROM gcr.io/distroless/nodejs22-debian12:nonroot

ENV TZ="Europe/Oslo"
ENV NODE_ENV production

WORKDIR /app

COPY ./webpack/faroConfig.js ./dist/public/nais.js
COPY ./dist ./dist

COPY ./node_modules ./node_modules
COPY server ./

CMD ["./server.js"]