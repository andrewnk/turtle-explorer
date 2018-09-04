#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE USER web WITH PASSWORD '$WEB_PASSWORD';
    CREATE USER service WITH PASSWORD '$SERVICE_PASSWORD';
    CREATE database daemon_cache;
    \connect daemon_cache;

    CREATE TABLE IF NOT EXISTS transactions (
        block LONGBLOB NOT NULL,
        tx LONGBLOB NOT NULL,
        txDetails LONGBLOB NOT NULL,
        hash VARCHAR(255) NOT NULL,
        paymentId VARCHAR(255),
        mixin BIGINT NOT NULL,
        size BIGINT NOT NULL,
        fee BIGINT,
        amount_out BIGINT,
        blockHash  VARCHAR(255) NOT NULL,
        PRIMARY KEY(hash,paymentId,blockHash)
    );

    CREATE INDEX IF NOT EXISTS on transactions (paymentId, blockHash);

    CREATE FUNCTION notify_transactions() RETURNS trigger
      LANGUAGE plpgsql
      AS '
    BEGIN
      PERFORM pg_notify(''transactions'', row_to_json(NEW)::text);
      RETURN NULL;
    END;
    ';

    CREATE TRIGGER updated_transactions_trigger AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE PROCEDURE notify_transactions();

    CREATE TABLE IF NOT EXISTS blocks (
      alreadyGeneratedCoins VARCHAR(255) NOT NULL,
      alreadyGeneratedTransactions BIGINT NOT NULL,
      baseReward BIGINT NOT NULL,
      blockSize BIGINT NOT NULL,
      difficulty BIGINT NOT NULL,
      effectiveSizeMedian BIGINT NOT NULL,
      hash VARCHAR(255) NOT NULL,
      height BIGINT NOT NULL,
      major_version BIGINT NOT NULL,
      minor_version BIGINT NOT NULL,
      nonce BIGINT NOT NULL,
      orphan_status BIGINT NOT NULL,
      penalty BIGINT NOT NULL,
      prev_hash VARCHAR(255) NOT NULL,
      reward BIGINT NOT NULL,
      sizeMedian BIGINT NOT NULL,
      timestamp BIGINT NOT NULL,
      totalFeeAmount NUMERIC NOT NULL,
      transactions LONGBLOB NOT NULL,
      transactionsCumulativeSize BIGINT NOT NULL,
      PRIMARY KEY(height, hash)
    )

    CREATE INDEX IF NOT EXISTS ON blocks (timestamp);

    CREATE FUNCTION notify_blocks() RETURNS trigger
      LANGUAGE plpgsql
      AS '
    BEGIN
      PERFORM pg_notify(''blocks'', row_to_json(NEW)::text);
      RETURN NULL;
    END;
    ';

    CREATE TRIGGER updated_blocks_trigger AFTER INSERT ON blocks
    FOR EACH ROW EXECUTE PROCEDURE notify_blocks();

    GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO service;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO web;
EOSQL

cp /tmp/conf/* /var/lib/postgresql/data/
