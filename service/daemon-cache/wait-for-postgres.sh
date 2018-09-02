#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
port="$2"
user="$3"
password="$4"
dbname="$5"
shift 5
cmd="$@"

until PGPASSWORD="$password" psql -h "$host" -p "$port" -U "$user" -d "$dbname" -c '\l'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 20
done

>&2 echo "Postgres is up - executing command"
exec $cmd
