#!/bin/bash

# Portfolio Project Verification Script
# Verifies all required files are present

echo "🔍 Verifying Portfolio Project Files..."
echo ""

MISSING_FILES=0
TOTAL_CHECKS=0

check_file() {
    ((TOTAL_CHECKS++))
    if [ -f "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ MISSING: $1"
        ((MISSING_FILES++))
    fi
}

check_dir() {
    ((TOTAL_CHECKS++))
    if [ -d "$1" ]; then
        echo "✅ $1/"
    else
        echo "❌ MISSING: $1/"
        ((MISSING_FILES++))
    fi
}

echo "📦 Core Configuration Files:"
check_file "package.json"
check_file "tsconfig.json"
check_file "tailwind.config.ts"
check_file "next.config.js"
check_file ".env.example"
check_file ".gitignore"
echo ""

echo "🎨 Application Files:"
check_file "app/layout.tsx"
check_file "app/page.tsx"
check_file "app/globals.css"
check_file "app/loading.tsx"
check_file "app/error.tsx"
check_file "app/not-found.tsx"
check_file "middleware.ts"
echo ""

echo "🔌 API Routes:"
check_file "app/api/github/profile/route.ts"
check_file "app/api/github/repos/route.ts"
echo ""

echo "🧩 Components:"
check_file "components/Navigation.tsx"
check_file "components/Hero.tsx"
check_file "components/About.tsx"
check_file "components/Projects.tsx"
check_file "components/Skills.tsx"
check_file "components/Contact.tsx"
check_file "components/Footer.tsx"
echo ""

echo "🎯 UI Components:"
check_file "components/ui/Button.tsx"
check_file "components/ui/Card.tsx"
check_file "components/ui/Badge.tsx"
check_file "components/ui/Spinner.tsx"
echo ""

echo "🛠️ Utilities:"
check_file "lib/utils.ts"
check_file "lib/constants.ts"
check_file "lib/github.ts"
check_file "lib/fetcher.ts"
check_file "lib/validation.ts"
check_file "lib/helpers.ts"
check_file "lib/logger.ts"
check_file "lib/cache.ts"
echo ""

echo "🪝 Custom Hooks:"
check_file "hooks/useIntersectionObserver.ts"
check_file "hooks/useScrollPosition.ts"
check_file "hooks/useTheme.ts"
check_file "hooks/useMediaQuery.ts"
echo ""

echo "📝 Type Definitions:"
check_file "types/index.ts"
check_file "types/api.ts"
echo ""

echo "📚 Documentation:"
check_file "README.md"
check_file "START_HERE.md"
check_file "GETTING_STARTED.md"
check_file "QUICKSTART.md"
check_file "DEVELOPMENT.md"
check_file "DEPLOYMENT.md"
check_file "FEATURES.md"
check_file "FAQ.md"
check_file "FILE_INDEX.md"
echo ""

echo "⚙️ Configuration:"
check_file "config/site.ts"
check_file ".eslintrc.js"
check_file ".prettierrc"
check_file "vercel.json"
check_file "netlify.toml"
echo ""

echo "🔧 Scripts:"
check_file "setup.sh"
check_file "setup.bat"
check_file "check.sh"
check_file "check.bat"
echo ""

echo "📁 Directories:"
check_dir "app"
check_dir "components"
check_dir "lib"
check_dir "hooks"
check_dir "types"
check_dir "public"
check_dir ".vscode"
check_dir ".github"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verification Summary:"
echo "Total checks: $TOTAL_CHECKS"
echo "Missing files: $MISSING_FILES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $MISSING_FILES -eq 0 ]; then
    echo "✅ All files verified! Project is complete."
    echo ""
    echo "Next steps:"
    echo "1. Run: npm install"
    echo "2. Copy .env.example to .env and configure"
    echo "3. Run: npm run dev"
    echo "4. Open: http://localhost:3000"
    echo ""
    echo "📖 Read START_HERE.md for complete instructions"
    exit 0
else
    echo "⚠️  Some files are missing. Please check the output above."
    exit 1
fi
