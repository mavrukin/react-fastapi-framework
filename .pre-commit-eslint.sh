#!/bin/bash
# Pre-commit hook script for eslint

if [ ! -d "frontend/node_modules" ]; then
  echo "Skipping eslint: frontend/node_modules not found. Run npm install in frontend/ first."
  exit 0
fi

cd frontend && npm run lint
