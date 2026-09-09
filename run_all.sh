#!/bin/bash
echo "Starting FastAPI backend..."
source venv/bin/activate
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Starting Frontend..."
cd ../frontend
npm run dev -- --host 0.0.0.0 --port 5174 &
FRONTEND_PID=$!

wait $BACKEND_PID
wait $FRONTEND_PID
