#!/bin/bash
# Pre-commit hook script for frontend build

if [ ! -d "frontend/node_modules" ]; then
  echo "Skipping frontend build: frontend/node_modules not found. Run npm install in frontend/ first."
  exit 0
fi

cd frontend || exit 1

# Run build
npm run build
