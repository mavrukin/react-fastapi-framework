# Reach FastAPI Framework

A full-stack web application framework with React frontend and FastAPI backend.

## Project Structure

```
reach_fastapi_framework/
├── frontend/          # React + TypeScript + Material-UI
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── services/     # API service layer
│   │   ├── types/        # TypeScript type definitions
│   │   └── __tests__/    # Test files
│   └── package.json
│
├── backend/          # FastAPI + SQLModel
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Configuration and core utilities
│   │   ├── db/           # Database configuration
│   │   ├── models/       # SQLModel database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── tests/        # Test suite
│   ├── alembic/          # Database migrations
│   └── requirements.txt
│
└── .pre-commit-config.yaml  # Pre-commit hooks configuration
```

## Prerequisites

- Python 3.11+ (system-installed)
- Node.js 18+ and npm
- Git

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip3 install -r requirements.txt
   pip3 install -r ../requirements-dev.txt
   ```

4. Copy the environment example file:
   ```bash
   cp env.example .env
   ```

5. Edit `.env` to configure your database:
   - For SQLite (development): `DATABASE_URL=sqlite:///./app.db`
   - For MySQL (production): `DATABASE_URL=mysql+pymysql://user:password@localhost:3306/dbname`

6. Initialize the database:
   ```bash
   alembic upgrade head
   ```

7. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000` and documentation at `http://localhost:8000/docs`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`.

## Database Migrations

### Creating a Migration

```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

### Applying Migrations

```bash
alembic upgrade head
```

### Rolling Back

```bash
alembic downgrade -1
```

## Testing

### Backend Tests

```bash
cd backend
pytest
```

Run with coverage:
```bash
pytest --cov=app --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Pre-commit Hooks

Pre-commit hooks are configured to automatically:
- Format Python code with Black
- Sort imports with isort
- Lint Python code with flake8
- Type check Python code with mypy
- Format TypeScript/JavaScript code with Prettier
- Lint TypeScript/JavaScript code with ESLint
- Check for common issues (trailing whitespace, large files, etc.)

Hooks run automatically on `git commit`. To run manually:
```bash
pre-commit run --all-files
```

## Development Workflow

1. Create a feature branch
2. Make your changes
3. Pre-commit hooks will run automatically on commit
4. Run tests locally before pushing
5. Create a pull request

## Database Configuration

The application supports both SQLite (for development/testing) and MySQL (for production).

### SQLite (Default)
- No additional setup required
- Database file created automatically
- Perfect for local development and CI/CD

### MySQL
1. Install MySQL server
2. Create a database
3. Update `.env` with MySQL connection string:
   ```
   DATABASE_URL=mysql+pymysql://user:password@localhost:3306/dbname
   ```
4. Run migrations: `alembic upgrade head`

## License

[Add your license here]
