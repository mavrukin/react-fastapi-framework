#!/bin/bash
# Pre-commit hook script for frontend build
# This matches the GitHub Actions workflow: runs npm run build

set -e

if [ ! -f "frontend/package.json" ]; then
  echo "ERROR: frontend/package.json not found. Frontend directory may not be set up correctly."
  exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "ERROR: frontend/node_modules not found."
  echo ""
  echo "To fix this, run:"
  echo "  cd frontend && npm install --legacy-peer-deps"
  echo ""
  echo "Frontend build cannot run without dependencies."
  exit 1
fi

cd frontend || exit 1

# Run build
npm run build
