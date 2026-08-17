@echo off
REM =============================================================================
REM Complete Project Verification Script (Windows)
REM =============================================================================
REM This script verifies that all necessary files and configurations are in place
REM Run this after setup to ensure everything is ready
REM =============================================================================

setlocal enabledelayedexpansion

set PASSED=0
set FAILED=0
set WARNINGS=0

echo.
echo ==================================================
echo   Portfolio Project - Verification
echo ==================================================
echo.

REM Check environment
echo Checking Environment...
echo ---

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [PASS] Node.js installed: !NODE_VERSION!
    set /a PASSED+=1
) else (
    echo [FAIL] Node.js not installed
    set /a FAILED+=1
)

where npm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo [PASS] npm installed: !NPM_VERSION!
    set /a PASSED+=1
) else (
    echo [FAIL] npm not installed
    set /a FAILED+=1
)

echo.

REM Check essential files
echo Checking Essential Files...
echo ---

set files=package.json next.config.ts tsconfig.json tailwind.config.ts .env.example

for %%f in (%files%) do (
    if exist %%f (
        echo [PASS] %%f exists
        set /a PASSED+=1
    ) else (
        echo [FAIL] %%f missing
        set /a FAILED+=1
    )
)

echo.

REM Check app structure
echo Checking App Structure...
echo ---

set app_files=app\layout.tsx app\page.tsx app\globals.css app\about\page.tsx app\projects\page.tsx app\contact\page.tsx app\api\contact\route.ts

for %%f in (%app_files%) do (
    if exist %%f (
        echo [PASS] %%f exists
        set /a PASSED+=1
    ) else (
        echo [FAIL] %%f missing
        set /a FAILED+=1
    )
)

echo.

REM Check components
echo Checking Components...
echo ---

set components=components\Hero.tsx components\About.tsx components\Skills.tsx components\Projects.tsx components\Contact.tsx components\Navigation.tsx components\Footer.tsx components\ThemeToggle.tsx

for %%c in (%components%) do (
    if exist %%c (
        echo [PASS] %%c exists
        set /a PASSED+=1
    ) else (
        echo [FAIL] %%c missing
        set /a FAILED+=1
    )
)

echo.

REM Check libraries
echo Checking Libraries...
echo ---

set libs=lib\data.ts lib\utils.ts lib\seo.ts lib\analytics.ts

for %%l in (%libs%) do (
    if exist %%l (
        echo [PASS] %%l exists
        set /a PASSED+=1
    ) else (
        echo [FAIL] %%l missing
        set /a FAILED+=1
    )
)

echo.

REM Check documentation
echo Checking Documentation...
echo ---

set docs=00-READ-FIRST.md README.md GETTING_STARTED.md CUSTOMIZATION.md DEPLOYMENT.md

for %%d in (%docs%) do (
    if exist %%d (
        echo [PASS] %%d exists
        set /a PASSED+=1
    ) else (
        echo [FAIL] %%d missing
        set /a FAILED+=1
    )
)

echo.

REM Check dependencies
echo Checking Dependencies...
echo ---

if exist node_modules (
    echo [PASS] node_modules directory exists
    set /a PASSED+=1
    
    REM Check critical packages
    if exist node_modules\next (
        echo [PASS] next installed
        set /a PASSED+=1
    ) else (
        echo [FAIL] next not installed
        set /a FAILED+=1
    )
    
    if exist node_modules\react (
        echo [PASS] react installed
        set /a PASSED+=1
    ) else (
        echo [FAIL] react not installed
        set /a FAILED+=1
    )
) else (
    echo [FAIL] node_modules not found - run 'npm install'
    set /a FAILED+=1
)

echo.

REM Check environment variables
echo Checking Environment Variables...
echo ---

if exist .env.local (
    echo [PASS] .env.local exists
    set /a PASSED+=1
) else (
    echo [WARN] .env.local not found (create from .env.example)
    set /a WARNINGS+=1
)

echo.

REM Check public directory
echo Checking Public Directory...
echo ---

if exist public (
    echo [PASS] public directory exists
    set /a PASSED+=1
    
    if exist public\images (
        echo [PASS] public\images directory exists
        set /a PASSED+=1
    ) else (
        echo [WARN] public\images directory not found
        set /a WARNINGS+=1
    )
) else (
    echo [FAIL] public directory not found
    set /a FAILED+=1
)

echo.

REM Run build checks
echo Running Build Check...
echo ---

echo [INFO] Testing TypeScript compilation...
call npm run type-check >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [PASS] TypeScript check passed
    set /a PASSED+=1
) else (
    echo [WARN] TypeScript has errors (check with: npm run type-check)
    set /a WARNINGS+=1
)

echo [INFO] Testing ESLint...
call npm run lint >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [PASS] ESLint check passed
    set /a PASSED+=1
) else (
    echo [WARN] ESLint has warnings (check with: npm run lint)
    set /a WARNINGS+=1
)

echo.

REM Print summary
echo ==================================================
echo   Verification Summary
echo ==================================================
echo.
echo Passed:   !PASSED!
echo Warnings: !WARNINGS!
echo Failed:   !FAILED!
echo.

if !FAILED! equ 0 (
    if !WARNINGS! equ 0 (
        echo [SUCCESS] All checks passed!
        echo Your project is ready to use.
    ) else (
        echo [WARNING] Verification passed with warnings
        echo Please review the warnings above.
    )
) else (
    echo [ERROR] Verification failed
    echo Please fix the failed checks above.
)

echo.

REM Print next steps
echo ==================================================
echo   Next Steps
echo ==================================================
echo.
echo 1. Review any warnings or failures above
echo 2. If all checks passed:
echo    - Customize lib\data.ts
echo    - Add your images to public\images\
echo    - Configure .env.local
echo    - Run: npm run dev
echo.
echo 3. Read documentation:
echo    - 00-READ-FIRST.md
echo    - GETTING_STARTED.md
echo    - CUSTOMIZATION.md
echo.

pause
