@echo off
REM Portfolio Setup Script for Windows
REM This script automates the initial setup of the portfolio project

echo Setting up your portfolio...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo Node.js found
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed. Please install npm first.
    exit /b 1
)

echo npm found
npm --version

REM Install dependencies
echo Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit .env and add your GitHub token and username
) else (
    echo .env file already exists
)

REM Create .vscode directory if it doesn't exist
if not exist .vscode mkdir .vscode

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Edit .env and add your GitHub token and username
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo See QUICKSTART.md for detailed instructions
echo See DEVELOPMENT.md for customization tips
echo.

pause
