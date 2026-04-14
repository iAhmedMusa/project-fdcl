FROM nginx:alpine

RUN apk add --no-cache curl

COPY docker/nginx/prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
