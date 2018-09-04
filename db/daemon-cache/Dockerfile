FROM timescale/timescaledb:0.9.2-pg10

ARG SERVICE_PASSWORD=98765
ENV SERVICE_PASSWORD=${SERVICE_PASSWORD}
ARG WEB_PASSWORD=98765
ENV WEB_PASSWORD=${WEB_PASSWORD}

RUN mkdir -p /tmp/conf

COPY ./conf /tmp/conf
COPY ./init.db.sh /docker-entrypoint-initdb.d