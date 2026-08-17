#!/bin/bash

# Quick verification script
echo "🔍 Running quick verification..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node -v)"
else
    echo "❌ Node.js not installed"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm -v)"
else
    echo "❌ npm not installed"
    exit 1
fi

# Check essential files
echo ""
echo "📁 Checking essential files..."
files=("package.json" "next.config.ts" "tsconfig.json" "tailwind.config.ts" "app/page.tsx" "lib/data.ts")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file missing"
    fi
done

# Check node_modules
echo ""
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed - run: npm install"
fi

# Check .env.local
if [ -f ".env.local" ]; then
    echo "✅ Environment configured"
else
    echo "⚠️  .env.local not found - copy from .env.example"
fi

echo ""
echo "✨ Quick verification complete!"
echo ""
echo "Next steps:"
echo "1. Read 00-READ-FIRST.md"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
