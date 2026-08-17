@echo off
REM Quick verification script for Windows

echo.
echo Running quick verification...
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do echo [PASS] Node.js: %%i
) else (
    echo [FAIL] Node.js not installed
    exit /b 1
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    for /f "tokens=*" %%i in ('npm -v') do echo [PASS] npm: %%i
) else (
    echo [FAIL] npm not installed
    exit /b 1
)

echo.
echo Checking essential files...

if exist package.json (echo [PASS] package.json) else (echo [FAIL] package.json)
if exist next.config.ts (echo [PASS] next.config.ts) else (echo [FAIL] next.config.ts)
if exist tsconfig.json (echo [PASS] tsconfig.json) else (echo [FAIL] tsconfig.json)
if exist app\page.tsx (echo [PASS] app\page.tsx) else (echo [FAIL] app\page.tsx)
if exist lib\data.ts (echo [PASS] lib\data.ts) else (echo [FAIL] lib\data.ts)

echo.
if exist node_modules (
    echo [PASS] Dependencies installed
) else (
    echo [WARN] Dependencies not installed - run: npm install
)

if exist .env.local (
    echo [PASS] Environment configured
) else (
    echo [WARN] .env.local not found - copy from .env.example
)

echo.
echo Quick verification complete!
echo.
echo Next steps:
echo 1. Read 00-READ-FIRST.md
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo.

pause
