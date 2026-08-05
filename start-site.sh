#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/.run-logs"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"

mkdir -p "$LOG_DIR"
rm -f "$BACKEND_LOG" "$FRONTEND_LOG"

kill_port() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    local pids
    pids=$(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)
    if [ -n "$pids" ]; then
      echo "Killing existing process(es) on port $port: $pids"
      for pid in $pids; do
        kill "$pid" 2>/dev/null || true
      done
      sleep 1
    fi
  fi
}

wait_for_port() {
  local port="$1"
  local retries=20
  while [ "$retries" -gt 0 ]; do
    if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.5
    retries=$((retries - 1))
  done
  return 1
}

start_backend() {
  echo "Starting backend..."
  kill_port 3001
  (
    cd "$BACKEND_DIR"
    HOST=127.0.0.1 PORT=3001 npm run dev
  ) >"$BACKEND_LOG" 2>&1 &
  echo $! > "$LOG_DIR/backend.pid"
}

start_frontend() {
  echo "Starting frontend..."
  kill_port 3000
  (
    cd "$FRONTEND_DIR"
    HOST=0.0.0.0 PORT=3000 npm run dev
  ) >"$FRONTEND_LOG" 2>&1 &
  echo $! > "$LOG_DIR/frontend.pid"
}

cleanup() {
  echo "Stopping services..."
  if [ -f "$LOG_DIR/backend.pid" ]; then
    kill "$(cat "$LOG_DIR/backend.pid")" 2>/dev/null || true
  fi
  if [ -f "$LOG_DIR/frontend.pid" ]; then
    kill "$(cat "$LOG_DIR/frontend.pid")" 2>/dev/null || true
  fi
  rm -f "$LOG_DIR/backend.pid" "$LOG_DIR/frontend.pid"
  exit 0
}

trap cleanup INT TERM

start_backend
start_frontend

if wait_for_port 3001; then
  echo "✅ Backend is listening on http://127.0.0.1:3001"
else
  echo "❌ Backend did not start in time. Check $BACKEND_LOG"
fi

if wait_for_port 3000; then
  echo "✅ Frontend is listening on http://localhost:3000"
else
  echo "❌ Frontend did not start in time. Check $FRONTEND_LOG"
fi

echo "Backend log: $BACKEND_LOG"
echo "Frontend log: $FRONTEND_LOG"
echo "Open http://localhost:3000"
echo "Press Ctrl+C to stop"

wait
