# GitHub Actions Workflows

This directory contains GitHub Actions workflows for continuous integration.

## Workflows

### `ci.yml` - Main CI Workflow
The primary workflow that runs on every push and pull request. It includes:
- **Backend Tests**: Runs pytest with coverage across Python 3.11, 3.12, and 3.13
- **Backend Linting**: Runs black, isort, flake8, and mypy
- **Frontend Tests**: Runs ESLint, Jest tests, and builds the application

### `pre-commit.yml` - Pre-commit Validation
Runs all pre-commit hooks to ensure code quality standards are met.

### `backend.yml` - Backend Only
Runs backend-specific tests and linting (can be used for backend-only changes).

### `frontend.yml` - Frontend Only
Runs frontend-specific tests and linting (can be used for frontend-only changes).

## Workflow Triggers

All workflows trigger on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop` branches

Path-based filtering is used in individual workflows to only run when relevant files change.

## Coverage

Code coverage is uploaded to Codecov (if configured) for:
- Backend: Python test coverage
- Frontend: Jest test coverage

## Database

Tests use SQLite for the database, which is perfect for CI/CD environments as it requires no setup.
