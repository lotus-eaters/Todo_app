# Setup Guide - TodoApp

## Prerequisites

- Python 3.8 or higher
- PostgreSQL database running
- pip and virtualenv installed

## Step 1: Create and Activate Virtual Environment

```bash
# Navigate to project root
cd /Users/hsmadhusudhan/Desktop/Todo_app/Todo_app

# Create virtual environment (already created)
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

## Step 2: Install Dependencies

### Option A: Install Core Dependencies Only (Production)

```bash
pip install -r requirements-core.txt
```

### Option B: Install Core + Development Dependencies (Development)

```bash
pip install -r requirements-dev.txt
```

### Option C: Install from Full Requirements

```bash
pip install -r requirements.txt
```

## Step 3: Configure Database

Edit `TodoApp_FastAPI/database.py` and ensure PostgreSQL connection details are correct:

```python
SQLALCHEMY_DATABASE_URL = 'postgresql://hsmadhusudhan@localhost:5432/TodoApplicationDatabase'
```

Verify PostgreSQL is running:

```bash
# macOS with Homebrew
brew services start postgresql

# Or connect directly
psql -U hsmadhusudhan -d TodoApplicationDatabase
```

## Step 4: Run the Backend

```bash
# Make sure venv is activated
source venv/bin/activate

# Run FastAPI server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or from the TodoApp_FastAPI directory:
cd TodoApp_FastAPI
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Access Swagger UI: `http://localhost:8000/docs`

## Step 5: Run the Frontend

In a new terminal:

```bash
cd frontend

# Option A: Python built-in server
python -m http.server 8080

# Option B: Node.js http-server
npx http-server -p 8080
```

Access the app: `http://localhost:8080/index.html`

## File Structure

```
Todo_app/
├── venv/                          # Virtual environment (created)
├── requirements.txt               # Full dependencies with versions
├── requirements-core.txt          # Core production dependencies
├── requirements-dev.txt           # Development dependencies
│
├── TodoApp_FastAPI/               # Backend
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── routers/
│
└── frontend/                      # Frontend
    ├── index.html
    ├── dashboard.html
    ├── css/style.css
    └── js/
```

## Core Dependencies Explained

| Package          | Version | Purpose                 |
| ---------------- | ------- | ----------------------- |
| fastapi          | 0.124.4 | Web framework           |
| uvicorn          | 0.33.0  | ASGI server             |
| sqlalchemy       | 2.0.48  | ORM for database        |
| psycopg2-binary  | 2.9.10  | PostgreSQL adapter      |
| python-jose      | 3.4.0   | JWT token handling      |
| passlib          | 1.7.4   | Password hashing        |
| bcrypt           | 5.0.0   | Secure password hashing |
| python-multipart | 0.0.20  | Form data parsing       |
| pydantic         | 2.10.6  | Data validation         |

## Development Dependencies

| Package        | Purpose                 |
| -------------- | ----------------------- |
| pytest         | Testing framework       |
| pytest-asyncio | Async testing support   |
| httpx          | HTTP client for testing |
| black          | Code formatter          |
| flake8         | Linter                  |
| isort          | Import sorter           |
| pylint         | Advanced linter         |
| python-dotenv  | Environment variables   |
| sphinx         | Documentation           |

## Verify Installation

```bash
# Check Python version
python --version

# Check pip packages
pip list

# Test FastAPI import
python -c "import fastapi; print(fastapi.__version__)"

# Test database connection
psql -U hsmadhusudhan -d TodoApplicationDatabase -c "SELECT version();"
```

## Environment Variables (Optional)

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=postgresql://hsmadhusudhan@localhost:5432/TodoApplicationDatabase

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
TOKEN_EXPIRE_MINUTES=20

# API
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=True
```

## Running Tests

```bash
# Install dev dependencies first
pip install -r requirements-dev.txt

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest TodoApp_FastAPI/test/test_auth.py -v
```

## Starting Fresh

If you need to reinstall everything:

```bash
# Deactivate current environment
deactivate

# Remove virtual environment
rm -rf venv

# Create new environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements-core.txt  # or requirements-dev.txt
```

## Troubleshooting

### PostgreSQL Connection Error

```bash
# Start PostgreSQL
brew services start postgresql

# Check if running
brew services list

# Connect directly
psql -U hsmadhusudhan
```

### Permission Denied (venv activation)

```bash
# Make activation script executable
chmod +x venv/bin/activate
source venv/bin/activate
```

### ModuleNotFoundError

```bash
# Ensure venv is activated
which python  # Should show path with /venv/

# Reinstall requirements
pip install -r requirements-core.txt
```

### Port Already in Use

```bash
# For port 8000
lsof -i :8000
kill -9 <PID>

# For port 8080
lsof -i :8080
kill -9 <PID>
```

## Next Steps

1. Virtual environment created
2. Dependencies installed
3. requirements.txt files created
4. → Run backend: `python -m uvicorn main:app --reload --port 8000`
5. → Run frontend: `python -m http.server 8080`
6. → Open browser: `http://localhost:8080/index.html`

## Additional Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- SQLAlchemy Docs: https://docs.sqlalchemy.org/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Pydantic Docs: https://docs.pydantic.dev/

---
