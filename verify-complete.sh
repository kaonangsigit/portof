#!/bin/bash

# =============================================================================
# Complete Project Verification Script
# =============================================================================
# This script verifies that all necessary files and configurations are in place
# Run this after setup to ensure everything is ready
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Functions
log_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

log_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_header() {
    echo ""
    echo "=================================================="
    echo "  Portfolio Project - Verification"
    echo "=================================================="
    echo ""
}

# Check Node.js and npm
check_environment() {
    echo "Checking Environment..."
    echo "---"
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        log_pass "Node.js installed: $NODE_VERSION"
    else
        log_fail "Node.js not installed"
    fi
    
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        log_pass "npm installed: $NPM_VERSION"
    else
        log_fail "npm not installed"
    fi
    
    echo ""
}

# Check essential files
check_essential_files() {
    echo "Checking Essential Files..."
    echo "---"
    
    essential_files=(
        "package.json"
        "next.config.ts"
        "tsconfig.json"
        "tailwind.config.ts"
        ".env.example"
    )
    
    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            log_pass "$file exists"
        else
            log_fail "$file missing"
        fi
    done
    
    echo ""
}

# Check app directory structure
check_app_structure() {
    echo "Checking App Structure..."
    echo "---"
    
    app_files=(
        "app/layout.tsx"
        "app/page.tsx"
        "app/globals.css"
        "app/about/page.tsx"
        "app/projects/page.tsx"
        "app/contact/page.tsx"
        "app/api/contact/route.ts"
    )
    
    for file in "${app_files[@]}"; do
        if [ -f "$file" ]; then
            log_pass "$file exists"
        else
            log_fail "$file missing"
        fi
    done
    
    echo ""
}

# Check components
check_components() {
    echo "Checking Components..."
    echo "---"
    
    components=(
        "components/Hero.tsx"
        "components/About.tsx"
        "components/Skills.tsx"
        "components/Projects.tsx"
        "components/Contact.tsx"
        "components/Navigation.tsx"
        "components/Footer.tsx"
        "components/ThemeToggle.tsx"
    )
    
    for component in "${components[@]}"; do
        if [ -f "$component" ]; then
            log_pass "$component exists"
        else
            log_fail "$component missing"
        fi
    done
    
    echo ""
}

# Check libraries
check_libraries() {
    echo "Checking Libraries..."
    echo "---"
    
    libs=(
        "lib/data.ts"
        "lib/utils.ts"
        "lib/seo.ts"
        "lib/analytics.ts"
    )
    
    for lib in "${libs[@]}"; do
        if [ -f "$lib" ]; then
            log_pass "$lib exists"
        else
            log_fail "$lib missing"
        fi
    done
    
    echo ""
}

# Check documentation
check_documentation() {
    echo "Checking Documentation..."
    echo "---"
    
    docs=(
        "00-READ-FIRST.md"
        "README.md"
        "GETTING_STARTED.md"
        "CUSTOMIZATION.md"
        "DEPLOYMENT.md"
    )
    
    for doc in "${docs[@]}"; do
        if [ -f "$doc" ]; then
            log_pass "$doc exists"
        else
            log_fail "$doc missing"
        fi
    done
    
    echo ""
}

# Check dependencies
check_dependencies() {
    echo "Checking Dependencies..."
    echo "---"
    
    if [ -d "node_modules" ]; then
        log_pass "node_modules directory exists"
        
        # Check critical packages
        critical_packages=(
            "next"
            "react"
            "react-dom"
            "typescript"
            "tailwindcss"
        )
        
        for package in "${critical_packages[@]}"; do
            if [ -d "node_modules/$package" ]; then
                log_pass "$package installed"
            else
                log_fail "$package not installed"
            fi
        done
    else
        log_fail "node_modules not found - run 'npm install'"
    fi
    
    echo ""
}

# Check environment variables
check_environment_vars() {
    echo "Checking Environment Variables..."
    echo "---"
    
    if [ -f ".env.local" ]; then
        log_pass ".env.local exists"
        
        # Check if it has content
        if [ -s ".env.local" ]; then
            log_pass ".env.local has content"
        else
            log_warn ".env.local is empty"
        fi
    else
        log_warn ".env.local not found (create from .env.example)"
    fi
    
    echo ""
}

# Check public directory
check_public_directory() {
    echo "Checking Public Directory..."
    echo "---"
    
    if [ -d "public" ]; then
        log_pass "public directory exists"
        
        if [ -d "public/images" ]; then
            log_pass "public/images directory exists"
        else
            log_warn "public/images directory not found"
        fi
    else
        log_fail "public directory not found"
    fi
    
    echo ""
}

# Run build check
run_build_check() {
    echo "Running Build Check..."
    echo "---"
    
    log_info "Testing TypeScript compilation..."
    if npm run type-check &> /dev/null; then
        log_pass "TypeScript check passed"
    else
        log_warn "TypeScript has errors (check with: npm run type-check)"
    fi
    
    log_info "Testing ESLint..."
    if npm run lint &> /dev/null; then
        log_pass "ESLint check passed"
    else
        log_warn "ESLint has warnings (check with: npm run lint)"
    fi
    
    echo ""
}

# Print summary
print_summary() {
    echo "=================================================="
    echo "  Verification Summary"
    echo "=================================================="
    echo ""
    echo -e "${GREEN}Passed:${NC}   $PASSED"
    echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
    echo -e "${RED}Failed:${NC}   $FAILED"
    echo ""
    
    if [ $FAILED -eq 0 ]; then
        if [ $WARNINGS -eq 0 ]; then
            echo -e "${GREEN}✓ All checks passed!${NC}"
            echo "Your project is ready to use."
        else
            echo -e "${YELLOW}⚠ Verification passed with warnings${NC}"
            echo "Please review the warnings above."
        fi
    else
        echo -e "${RED}✗ Verification failed${NC}"
        echo "Please fix the failed checks above."
        exit 1
    fi
    
    echo ""
}

# Print next steps
print_next_steps() {
    echo "=================================================="
    echo "  Next Steps"
    echo "=================================================="
    echo ""
    echo "1. Review any warnings or failures above"
    echo "2. If all checks passed:"
    echo "   - Customize lib/data.ts"
    echo "   - Add your images to public/images/"
    echo "   - Configure .env.local"
    echo "   - Run: npm run dev"
    echo ""
    echo "3. Read documentation:"
    echo "   - 00-READ-FIRST.md"
    echo "   - GETTING_STARTED.md"
    echo "   - CUSTOMIZATION.md"
    echo ""
}

# Main execution
main() {
    print_header
    check_environment
    check_essential_files
    check_app_structure
    check_components
    check_libraries
    check_documentation
    check_dependencies
    check_environment_vars
    check_public_directory
    run_build_check
    print_summary
    print_next_steps
}

# Run main
main
