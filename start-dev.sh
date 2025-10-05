#!/bin/bash

# Start script for Team Maverics GitHub Discovery Engine
echo "🚀 Starting Team Maverics GitHub Discovery Engine..."

# Check if backend is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend already running on port 3001"
else
    echo "🔧 Starting backend..."
    cd backend && npm start &
    sleep 3
fi

# Check if frontend is already running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Frontend already running on port 5173"
else
    echo "🎨 Starting frontend..."
    cd frontend && npm run dev &
    sleep 2
fi

echo "🎉 Both services should be starting up!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001"
echo "❤️  Health Check: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
