FROM nginx:1.17.8-alpine

# bash er ikke standard i alpine:
RUN apk add --no-cache bash

ADD nginx.conf /etc/nginx/conf.d/app.conf.template

ENV APP_DIR="client/app" \
  APP_PATH_PREFIX="/k9-los" \
  APP_CALLBACK_PATH="/k9-los/cb" \
  APP_URL_FPTILBAKE="http://fptilbake" \
  APP_URL_LOS="http://k9-los-api"

COPY target/index.html /usr/share/nginx/html
COPY target/public /usr/share/nginx/html

EXPOSE 8030 443

# using bash over sh for better signal-handling
SHELL ["/bin/bash", "-c"]
ADD start-server.sh /start-server.sh
CMD /start-server.sh

