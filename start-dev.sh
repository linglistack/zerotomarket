#!/bin/bash

# ZeroToMarket Development Startup Script

echo "🚀 Starting ZeroToMarket Development Environment..."

# Check if backend directory exists
if [ ! -d "BACKEND" ]; then
    echo "❌ Backend directory not found. Please ensure BACKEND folder exists."
    exit 1
fi

# Start backend in background
echo "🔧 Starting AgentKit Backend..."
cd BACKEND
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting React Frontend..."
npm start &
FRONTEND_PID=$!

echo "✅ Development environment started!"
echo "📊 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo "🔍 Health Check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $FRONTEND_PID $BACKEND_PID 