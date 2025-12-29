#!/bin/bash
# Pre-commit hook script for frontend tests

if [ ! -d "frontend/node_modules" ]; then
  echo "Skipping frontend tests: frontend/node_modules not found. Run npm install in frontend/ first."
  exit 0
fi

cd frontend || exit 1

# Run tests with the same flags as GitHub Actions
npm test -- --coverage --watchAll=false
