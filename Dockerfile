FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-slim

ENV TZ="Europe/Oslo"
ENV NODE_ENV=production

WORKDIR /app

COPY ./dist ./dist

# ./deploy er en selvstendig pnpm-deploy av @k9-los-web/server
# og inneholder server.js, package.json og node_modules
COPY ./deploy ./

CMD ["./server.js"]
