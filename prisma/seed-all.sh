#!/bin/bash
set -e

echo "🌱 Running demo users seed..."
npx tsx prisma/seed-demo-users.ts

echo "🌱 Running SQL seed files..."
for f in prisma/seed/*.sql; do
  if [ -f "$f" ]; then
    echo "  → $f"
    npx prisma db execute --file "$f"
  fi
done

echo "✅ All seeds completed."
