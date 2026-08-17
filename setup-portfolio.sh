#!/bin/bash

echo "🚀 Installing Portfolio Dependencies..."
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
  echo "⚠️  node_modules exists. Running clean install..."
  rm -rf node_modules package-lock.json
fi

# Install dependencies
echo "📦 Installing npm packages..."
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "📁 Creating content directories..."

# Create content directories if they don't exist
mkdir -p content/certificates
mkdir -p content/projects
mkdir -p content/blog
mkdir -p content/data
mkdir -p public/images/certificates
mkdir -p public/images/projects
mkdir -p public/images/blog

echo "✅ Content directories created!"
echo ""
echo "🎯 Next Steps:"
echo "1. Copy .env.example to .env.local and add your GitHub username"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Check README-CMS.md for content management guide"
echo ""
echo "🌟 All set! Happy coding!"
