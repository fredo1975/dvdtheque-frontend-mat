#!/bin/bash

envsubst < /usr/share/nginx/html/assets/config/config.prod.json > /usr/share/nginx/html/assets/config/config.json
envsubst "\$BACKEND_BASE_PATH" < /temp/nginx.conf > /etc/nginx/conf.d/nginx.conf

exec "$@"