#!/bin/bash
cd "/Users/kaonangprakoso/Library/Mobile Documents/com~apple~CloudDocs/Portofolio"
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi
echo "Checking .env.local..."
if ! grep -q "NEXT_PUBLIC_GITHUB_USERNAME" .env.local; then
  echo "NEXT_PUBLIC_GITHUB_USERNAME=your-github-username" >> .env.local
fi
echo "Starting dev server..."
npm run dev
