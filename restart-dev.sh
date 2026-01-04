#!/bin/bash

echo "🔄 Restarting Digital Closet Dev Server..."
echo ""

# Step 1: Kill existing dev server
echo "1️⃣  Stopping dev server..."
pkill -f "bun run dev" 2>/dev/null || true
sleep 2

# Step 2: Clear caches
echo "2️⃣  Clearing build caches..."
rm -rf .next
rm -rf node_modules/.cache 2>/dev/null || true
echo "   ✓ Caches cleared"

# Step 3: Start dev server
echo ""
echo "3️⃣  Starting dev server..."
echo "   Server will be available at http://localhost:3000"
echo ""

bun run dev
