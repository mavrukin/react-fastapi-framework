#!/bin/bash
# Pre-commit hook script for backend tests

cd backend || exit 1

# Check if pytest is available
if ! python3.14 -m pytest --version >/dev/null 2>&1; then
  echo "Skipping backend tests: pytest not installed. Run 'pip3 install -r ../requirements-dev.txt' first."
  exit 0
fi

# Check if required dependencies are available
if ! python3.14 -c "import fastapi, sqlmodel" >/dev/null 2>&1; then
  echo "Skipping backend tests: required dependencies not installed. Run 'pip3 install -r requirements.txt -r ../requirements-dev.txt' first."
  exit 0
fi

# Set test database URL
export DATABASE_URL=sqlite:///./test.db

# Run pytest with the same flags as GitHub Actions
# Use python3.14 explicitly to match the project's Python version
python3.14 -m pytest --cov=app --cov-report=term-missing -v
