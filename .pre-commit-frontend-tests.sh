#!/bin/bash
# Pre-commit hook script for frontend tests
# This matches the GitHub Actions workflow: runs npm test -- --coverage --watchAll=false

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
  echo "Frontend tests cannot run without dependencies."
  exit 1
fi

cd frontend || exit 1

# Run tests with the same flags as GitHub Actions
npm test -- --coverage --watchAll=false
