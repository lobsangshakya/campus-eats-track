#!/bin/bash

# Campus Eats Development Startup Script
echo "🚀 Starting Campus Eats Development Environment..."

# Check if .env file exists in server directory
if [ ! -f "server/.env" ]; then
    echo "⚠️  No .env file found in server directory"
    echo "📝 Please create server/.env with your Twilio credentials:"
    echo "   Copy server/env.example to server/.env and fill in your Twilio details"
    echo ""
    echo "🔗 Get Twilio credentials from: https://console.twilio.com/"
    echo ""
    read -p "Press Enter to continue anyway (backend will fail without credentials)..."
fi

# Start backend server in background
echo "🔧 Starting backend server..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend development server
echo "🎨 Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001"
echo "📊 Health check: http://localhost:3001/health"
echo ""
echo "🛑 To stop both servers, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
