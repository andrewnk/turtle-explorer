#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE USER go WITH PASSWORD '$GO_PASSWORD';
    CREATE USER web WITH PASSWORD '$WEB_PASSWORD';
    CREATE database trtl;
    \connect trtl;
    CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

    CREATE TABLE node (
      id SERIAL CONSTRAINT node_pk PRIMARY KEY,
      name VARCHAR NOT NULL,
      url TEXT NOT NULL,
      port INTEGER NOT NULL
    );
    CREATE INDEX ON node (name, id);

    CREATE FUNCTION notify_node() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
    BEGIN
      PERFORM pg_notify('node', row_to_json(NEW)::text);
      RETURN NULL;
    END;
    $$;

    CREATE TRIGGER updated_node_trigger AFTER INSERT ON node
    FOR EACH ROW EXECUTE PROCEDURE notify_node();

    CREATE TABLE node_data (
      time TIMESTAMPTZ,
      node_id INTEGER NOT NULL references node(id),
      data JSONB
    );
    SELECT create_hypertable('node_data', 'time');
    CREATE INDEX ON node_data (node_id, time DESC);
    CREATE INDEX idxgin_node_data ON node_data USING GIN (data);

    CREATE FUNCTION notify_node_data() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
    BEGIN
      PERFORM pg_notify('nodeData', row_to_json(NEW)::text);
      RETURN NULL;
    END;
    $$;

    CREATE TRIGGER updated_nodedata_trigger AFTER INSERT ON node_data
    FOR EACH ROW EXECUTE PROCEDURE notify_node_data();

    CREATE TABLE pool (
      id SERIAL CONSTRAINT pool_pk PRIMARY KEY,
      name VARCHAR NOT NULL,
      url TEXT NOT NULL,
      api TEXT NOT NULL,
      type VARCHAR NOT NULL
    );
    CREATE INDEX ON pool (name, id);

    CREATE FUNCTION notify_pool() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
    BEGIN
      PERFORM pg_notify('pool', row_to_json(NEW)::text);
      RETURN NULL;
    END;
    $$;

    CREATE TRIGGER updated_pool_trigger AFTER INSERT ON pool
    FOR EACH ROW EXECUTE PROCEDURE notify_pool();

    CREATE TABLE pool_data (
      time TIMESTAMPTZ,
      pool_id INTEGER NOT NULL references pool(id),
      data JSONB
    );
    SELECT create_hypertable('pool_data', 'time');
    CREATE INDEX ON pool_data (pool_id, time DESC);
    CREATE INDEX idxgin_pool_data ON pool_data USING GIN (data);

    CREATE FUNCTION notify_pool_data() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
    BEGIN
      PERFORM pg_notify('poolConfig', json_build_object('poolConfig', NEW.data->'config', 'poolId', NEW.pool_id)::text);
      PERFORM pg_notify('poolNetwork', json_build_object('poolNetwork', NEW.data->'network', 'poolId', NEW.pool_id)::text);
      PERFORM pg_notify('poolPool', json_build_object('poolPool', NEW.data->'pool', 'poolId', NEW.pool_id)::text);
      RETURN NULL;
    END;
    $$;

    CREATE TRIGGER updated_pooldata_trigger AFTER INSERT ON pool_data
    FOR EACH ROW EXECUTE PROCEDURE notify_pool_data();

    GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO go;
    GRANT USAGE, SELECT ON SEQUENCE node_id_seq TO go;
    GRANT USAGE, SELECT ON SEQUENCE pool_id_seq TO go;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO web;
EOSQL

cp /tmp/conf/* /var/lib/postgresql/data/
