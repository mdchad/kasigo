#!/bin/sh

echo "Starting database migrations..."
npx tsx src/db/migrate.ts

if [ $? -eq 0 ]; then
    echo "Migrations completed successfully. Starting server..."
    node dist/index.js
else
    echo "Migration failed. Exiting..."
    exit 1
fi 