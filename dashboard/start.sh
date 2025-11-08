#!/bin/bash

echo "🚀 Starting Touch of Terra Homelessness Dashboard..."
echo ""

# Start backend
echo "📡 Starting backend API on port 5000..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend on port 5173..."
cd ../frontend/touch-of-terra-dashboard
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Dashboard is starting up!"
echo ""
echo "📊 Frontend: http://localhost:5173"
echo "🔌 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
