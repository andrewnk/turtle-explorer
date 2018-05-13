#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE USER go WITH PASSWORD '$GO_PASSWORD';
    CREATE USER web WITH PASSWORD '$WEB_PASSWORD';
    CREATE database trtl;
    \connect trtl;
    CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

    CREATE TABLE nodes (
      time TIMESTAMPTZ,
      name varchar NOT NULL,
      data JSONB
    );
    SELECT create_hypertable('nodes', 'time');
    CREATE INDEX ON nodes (name, time DESC);
    CREATE INDEX idxgin_nodes ON nodes USING GIN (data);

    CREATE TABLE pools (
      time TIMESTAMPTZ,
      name varchar NOT NULL,
      data JSONB
    );
    SELECT create_hypertable('pools', 'time');
    CREATE INDEX ON pools (name, time DESC);
    CREATE INDEX idxgin_pools ON pools USING GIN (data);

    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO go;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO web;
EOSQL

cp /tmp/conf/* /var/lib/postgresql/data/
