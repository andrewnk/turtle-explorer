#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE USER go WITH PASSWORD '$GO_PASSWORD';
    CREATE USER web WITH PASSWORD '$WEB_PASSWORD';
    CREATE database trtl;
    \connect trtl;
    CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

    CREATE TABLE nodes (
      id SERIAL CONSTRAINT nodes_pk PRIMARY KEY,
      name VARCHAR NOT NULL,
      url TEXT NOT NULL,
      port INTEGER NOT NULL
    );
    CREATE INDEX ON nodes (name, id);

    CREATE TABLE node_data (
      time TIMESTAMPTZ,
      node_id INTEGER NOT NULL references nodes(id),
      data JSONB
    );
    SELECT create_hypertable('node_data', 'time');
    CREATE INDEX ON node_data (node_id, time DESC);
    CREATE INDEX idxgin_node_data ON node_data USING GIN (data);

    CREATE TABLE pools (
      id SERIAL CONSTRAINT pools_pk PRIMARY KEY,
      name VARCHAR NOT NULL,
      url TEXT NOT NULL,
      api TEXT NOT NULL,
      type VARCHAR NOT NULL
    );
    CREATE INDEX ON pools (name, id);

    CREATE TABLE pool_data (
      time TIMESTAMPTZ,
      pool_id INTEGER NOT NULL references pools(id),
      data JSONB
    );
    SELECT create_hypertable('pool_data', 'time');
    CREATE INDEX ON pool_data (pool_id, time DESC);
    CREATE INDEX idxgin_pool_data ON pool_data USING GIN (data);

    GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO go;
    GRANT USAGE, SELECT ON SEQUENCE nodes_id_seq TO go;
    GRANT USAGE, SELECT ON SEQUENCE pools_id_seq TO go;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO web;
EOSQL

cp /tmp/conf/* /var/lib/postgresql/data/
