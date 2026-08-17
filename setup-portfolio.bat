@echo off
echo 🚀 Installing Portfolio Dependencies...
echo.

REM Check if node_modules exists
if exist "node_modules" (
  echo ⚠️  node_modules exists. Running clean install...
  rmdir /s /q node_modules
  del package-lock.json
)

REM Install dependencies
echo 📦 Installing npm packages...
call npm install

echo.
echo ✅ Installation complete!
echo.
echo 📁 Creating content directories...

REM Create content directories if they don't exist
if not exist "content\certificates" mkdir content\certificates
if not exist "content\projects" mkdir content\projects
if not exist "content\blog" mkdir content\blog
if not exist "content\data" mkdir content\data
if not exist "public\images\certificates" mkdir public\images\certificates
if not exist "public\images\projects" mkdir public\images\projects
if not exist "public\images\blog" mkdir public\images\blog

echo ✅ Content directories created!
echo.
echo 🎯 Next Steps:
echo 1. Copy .env.example to .env.local and add your GitHub username
echo 2. Run 'npm run dev' to start the development server
echo 3. Check README-CMS.md for content management guide
echo.
echo 🌟 All set! Happy coding!
pause
