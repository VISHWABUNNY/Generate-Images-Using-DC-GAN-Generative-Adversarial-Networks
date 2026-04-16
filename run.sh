#!/usr/bin/env bash
set -e

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_VENV="$BACKEND_DIR/.venv"
BACKEND_LOG="/tmp/dcgan-backend.log"
FRONTEND_LOG="/tmp/dcgan-frontend.log"

echo "Root: $ROOT_DIR"

# Choose Python interpreter
if command -v python3.10 >/dev/null 2>&1; then
  PYTHON=python3.10
elif command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
else
  echo "Error: Python 3 is required but not installed." >&2
  exit 1
fi

# Create backend venv if missing
if [ ! -d "$BACKEND_VENV" ]; then
  echo "Creating backend virtual environment..."
  "$PYTHON" -m venv "$BACKEND_VENV"
fi

# Install backend dependencies
echo "Installing backend dependencies..."
"$BACKEND_VENV/bin/python" -m pip install --upgrade pip
"$BACKEND_VENV/bin/python" -m pip install -r "$BACKEND_DIR/requirements.txt"

# Install frontend dependencies
if [ -f "$FRONTEND_DIR/package.json" ]; then
  if ! command -v npm >/dev/null 2>&1; then
    echo "Error: npm is required for frontend dependency installation." >&2
    exit 1
  fi
  echo "Installing frontend dependencies..."
  cd "$FRONTEND_DIR"
  npm install
fi

# Stop existing servers if running
echo "Stopping any existing backend/frontend servers..."
pkill -f "backend/app.py" >/dev/null 2>&1 || true
pkill -f "http.server 8000" >/dev/null 2>&1 || true

# Start backend and frontend services
cd "$ROOT_DIR"
echo "Starting frontend server..."
nohup python3 -m http.server 8000 --directory "$FRONTEND_DIR" > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!

echo "Starting backend server in foreground..."
echo "Backend URL: http://127.0.0.1:5000"
echo "Frontend URL: http://127.0.0.1:8000"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend log: $BACKEND_LOG"
echo "Frontend log: $FRONTEND_LOG"
echo "Press Ctrl+C to stop the backend and then the frontend will also be stopped."

trap 'echo "Stopping frontend..."; kill "$FRONTEND_PID" >/dev/null 2>&1 || true; exit 0' SIGINT SIGTERM

"$BACKEND_VENV/bin/python" "$BACKEND_DIR/app.py"

# When backend exits, stop frontend too.
echo "Backend exited, stopping frontend..."
kill "$FRONTEND_PID" >/dev/null 2>&1 || true
