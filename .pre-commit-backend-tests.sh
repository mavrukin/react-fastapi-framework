#!/bin/bash
# Pre-commit hook script for backend tests

cd backend || exit 1

# Set test database URL
export DATABASE_URL=sqlite:///./test.db

# Run pytest with the same flags as GitHub Actions
pytest --cov=app --cov-report=term-missing -v
