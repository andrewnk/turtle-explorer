#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE USER web WITH PASSWORD '$WEB_PASSWORD';
    CREATE USER service WITH PASSWORD '$SERVICE_PASSWORD';
    CREATE database daemon_cache;
    \connect daemon_cache;

    CREATE TABLE IF NOT EXISTS block (
      height BIGINT NOT NULL,
      hash VARCHAR(255) NOT NULL CONSTRAINT block_pk,
      data JSONB NOT NULL
      PRIMARY KEY(height, hash)
    )

    CREATE INDEX IF NOT EXISTS ON block (hash, height);
    CREATE INDEX idxgin_block ON block USING GIN (data);

    CREATE FUNCTION notify_block() RETURNS trigger
      LANGUAGE plpgsql
      AS '
    BEGIN
      PERFORM pg_notify(''block'', height);
      RETURN NULL;
    END;
    ';

    CREATE TRIGGER updated_block_trigger AFTER INSERT ON block
    FOR EACH ROW EXECUTE PROCEDURE notify_block();

    CREATE TABLE IF NOT EXISTS transaction (
        block_hash VARCHAR(255) NOT NULL references block(hash),
        data JSONB NOT NULL
        PRIMARY KEY(data)
    );

    CREATE INDEX IF NOT EXISTS on transaction (block_hash);
    CREATE INDEX idxgin_transaction ON transaction USING GIN (data);

    CREATE FUNCTION notify_transaction() RETURNS trigger
      LANGUAGE plpgsql
      AS '
    BEGIN
      PERFORM pg_notify(''transaction'', block_hash);
      RETURN NULL;
    END;
    ';

    CREATE TRIGGER updated_transaction_trigger AFTER INSERT ON transaction
    FOR EACH ROW EXECUTE PROCEDURE notify_transaction();

    CREATE TABLE IF NOT EXISTS mempool (
        id SERIAL,
        data JSONB NOT NULL
        PRIMARY KEY(data)
    );

    CREATE INDEX IF NOT EXISTS on mempool (id);
    CREATE INDEX idxgin_mempool ON mempool USING GIN (data);

    CREATE FUNCTION notify_mempool() RETURNS trigger
      LANGUAGE plpgsql
      AS '
    BEGIN
      PERFORM pg_notify(''mempool'', id);
      RETURN NULL;
    END;
    ';

    CREATE TRIGGER updated_mempool_trigger AFTER INSERT ON mempool
    FOR EACH ROW EXECUTE PROCEDURE notify_mempool();

    GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO service;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO web;
EOSQL

cp /tmp/conf/* /var/lib/postgresql/data/
