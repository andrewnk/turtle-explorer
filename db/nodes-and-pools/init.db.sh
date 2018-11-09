#!/bin/sh
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
      port INTEGER NOT NULL,
      ssl BOOLEAN NOT NULL
    );
    CREATE INDEX ON node (name, id);

    CREATE FUNCTION notify_node() RETURNS trigger
      LANGUAGE plpgsql
      AS '
    BEGIN
      PERFORM pg_notify(''node'', row_to_json(NEW)::text);
      RETURN NULL;
    END;
    ';

    CREATE TRIGGER updated_node_trigger AFTER INSERT ON node
    FOR EACH ROW EXECUTE PROCEDURE notify_node();

    CREATE TABLE node_data (
      time TIMESTAMPTZ,
      node_id INTEGER NOT NULL references node(id),
      alt_blocks_count BIGINT NOT NULL DEFAULT 0,
      difficulty BIGINT NOT NULL DEFAULT 0,
      gray_peerlist_size BIGINT NOT NULL DEFAULT 0,
      hashrate BIGINT NOT NULL DEFAULT 0,
      height BIGINT NOT NULL DEFAULT 0,
      incoming_connections_count BIGINT NOT NULL DEFAULT 0,
      last_known_block_index BIGINT NOT NULL DEFAULT 0,
      major_version BIGINT NOT NULL DEFAULT 0,
      minor_version BIGINT NOT NULL DEFAULT 0,
      network_height BIGINT NOT NULL DEFAULT 0,
      outgoing_connections_count BIGINT NOT NULL DEFAULT 0,
      start_time BIGINT NOT NULL DEFAULT 0,
      status VARCHAR NOT NULL DEFAULT 'Unreachable',
      supported_height BIGINT NOT NULL DEFAULT 0,
      synced BOOLEAN NOT NULL DEFAULT false,
      testnet BOOLEAN NOT NULL DEFAULT false,
      tx_count BIGINT NOT NULL DEFAULT 0,
      tx_pool_size BIGINT NOT NULL DEFAULT 0,
      version VARCHAR NOT NULL DEFAULT '0',
      white_peerlist_size BIGINT NOT NULL DEFAULT 0,
      fee DECIMAL NOT NULL DEFAULT 0
    );
    SELECT create_hypertable('node_data', 'time');
    CREATE INDEX ON node_data (node_id, height, difficulty, hashrate, time DESC);

    CREATE FUNCTION notify_node_data() RETURNS trigger
      LANGUAGE plpgsql
      AS '
    BEGIN
      PERFORM pg_notify(''nodeData'', row_to_json(NEW)::text);
      RETURN NULL;
    END;
    ';

    CREATE TRIGGER updated_nodedata_trigger AFTER INSERT ON node_data
    FOR EACH ROW EXECUTE PROCEDURE notify_node_data();

    CREATE TABLE pool (
      id SERIAL CONSTRAINT pool_pk PRIMARY KEY,
      name VARCHAR NOT NULL,
      url TEXT NOT NULL,
      api TEXT NOT NULL,
      software VARCHAR NOT NULL,
      mining_address VARCHAR NOT NULL,
      trusted BOOLEAN
    );
    CREATE INDEX ON pool (name, id);

    CREATE FUNCTION notify_pool() RETURNS trigger
      LANGUAGE plpgsql
      AS '
    BEGIN
      PERFORM pg_notify(''pool'', row_to_json(NEW)::text);
      RETURN NULL;
    END;
    ';

    CREATE TRIGGER updated_pool_trigger AFTER INSERT ON pool
    FOR EACH ROW EXECUTE PROCEDURE notify_pool();

    CREATE TABLE pool_data (
      time TIMESTAMPTZ,
      pool_id INTEGER NOT NULL references pool(id),
      miners BIGINT NOT NULL DEFAULT 0,
      min_payout BIGINT NOT NULL DEFAULT 0,
      hashrate BIGINT NOT NULL DEFAULT 0,
      height BIGINT NOT NULL DEFAULT 0,
      total_payments BIGINT NOT NULL DEFAULT 0,
      miners_paid BIGINT NOT NULL DEFAULT 0,
      total_blocks BIGINT NOT NULL DEFAULT 0,
      last_block_found VARCHAR,
      difficulty BIGINT NOT NULL DEFAULT 0,
      status VARCHAR NOT NULL DEFAULT 'Unreachable',
      timestamp BIGINT NOT NULL DEFAULT 0
    );
    SELECT create_hypertable('pool_data', 'time');
    CREATE INDEX ON pool_data (pool_id, height, difficulty, hashrate, miners, time DESC);

    CREATE FUNCTION notify_pool_data() RETURNS trigger
      LANGUAGE plpgsql
      AS '
    BEGIN
      PERFORM pg_notify(''poolData'', row_to_json(NEW)::text);
      RETURN NULL;
    END;
    ';

    CREATE TRIGGER updated_pooldata_trigger AFTER INSERT ON pool_data
    FOR EACH ROW EXECUTE PROCEDURE notify_pool_data();

    CREATE TABLE pool_fee (
      id SERIAL CONSTRAINT pool_fee_pk PRIMARY KEY,
      pool_id INTEGER NOT NULL references pool(id),
      fee_type VARCHAR,
      fee DECIMAL NOT NULL DEFAULT 0
    );
    CREATE INDEX ON pool_fee (pool_id, id);

    CREATE TABLE pool_config (
      id SERIAL CONSTRAINT pool_config_pk PRIMARY KEY,
      pool_id INTEGER NOT NULL references pool(id),
      fee_id INTEGER references pool_fee(id),
      port BIGINT NOT NULL,
      difficulty BIGINT NOT NULL,
      description VARCHAR NOT NULL
    );
    CREATE INDEX ON pool_config (pool_id, id);

    GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO go;
    GRANT USAGE, SELECT ON SEQUENCE node_id_seq TO go;
    GRANT USAGE, SELECT ON SEQUENCE pool_id_seq TO go;
    GRANT USAGE, SELECT ON SEQUENCE pool_config_id_seq TO go;
    GRANT USAGE, SELECT ON SEQUENCE pool_fee_id_seq TO go;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO web;
EOSQL

cp /tmp/conf/* /var/lib/postgresql/data/
