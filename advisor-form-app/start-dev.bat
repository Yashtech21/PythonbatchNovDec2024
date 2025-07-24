@echo off
setlocal

REM Advisor Form App - Development Startup Script for Windows

echo 🚀 Starting Advisor Form Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed.
echo.

REM Install backend dependencies if node_modules doesn't exist
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
    echo ✅ Backend dependencies installed.
) else (
    echo ✅ Backend dependencies already installed.
)

REM Install frontend dependencies if node_modules doesn't exist
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
    echo ✅ Frontend dependencies installed.
) else (
    echo ✅ Frontend dependencies already installed.
)

echo.
echo 🔧 Starting servers...
echo.

REM Create data directory if it doesn't exist
if not exist "data" mkdir data

REM Start backend server
echo 🚢 Starting backend server on http://localhost:5000...
cd backend
start "Backend Server" cmd /k npm start
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo ⚛️ Starting frontend server on http://localhost:3000...
cd frontend
start "Frontend Server" cmd /k npm start
cd ..

echo.
echo 🎉 Application started successfully!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🛠️ Backend:  http://localhost:5000
echo.
echo Both servers are running in separate windows.
echo Close the terminal windows to stop the servers.
echo.
pause