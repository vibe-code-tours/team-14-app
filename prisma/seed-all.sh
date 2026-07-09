#!/bin/bash
set -e

echo "🌱 Running admin user seed..."
npx tsx prisma/seed-admin.ts

echo "🌱 Running SQL seed files..."
for f in prisma/seed/*.sql; do
  if [ -f "$f" ]; then
    echo "  → $f"
    npx prisma db execute --file "$f"
  fi
done

echo "✅ All seeds completed."
