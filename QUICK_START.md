# TodoApp Quick Start Guide

## Step 1: Start the Backend

```bash
cd TodoApp_FastAPI
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`

**Verify** it's running:

```bash
curl http://localhost:8000/healthy
# Should return: {"Status":"Healthy"}
```

## Step 2: Start the Frontend

```bash
cd frontend

# Option A: Using Python
python -m http.server 8080

# Option B: Using Node.js (if installed)
npx http-server -p 8080

# Option C: Using Docker
docker run -d -p 8080:80 -v $(pwd):/usr/share/nginx/html nginx
```

The frontend will be available at: `http://localhost:8080`

## Step 3: Access the App

1. Open your browser and navigate to: `http://localhost:8080/index.html`
2. Create a new account or login
3. Start managing your todos!

## Test Credentials (if you have pre-created users)

```
Username: testuser
Password: testpass123
```

## Common Commands

### Restart Backend

```bash
# Stop with Ctrl+C, then:
python -m uvicorn main:app --reload --port 8000
```

### Clear All Frontend Data (localStorage)

```javascript
// In browser console:
localStorage.clear();
window.location.reload();
```

### View API Docs

```
http://localhost:8000/docs          # Swagger UI
http://localhost:8000/redoc         # ReDoc
```

## 🔧 Configuration

### Update API URL (if backend is on different port/host)

Edit `frontend/js/api.js`:

```javascript
const API_BASE_URL = "http://your-backend-url:8000";
```

### Update CORS Settings (for production)

Edit `TodoApp_FastAPI/main.py`:

```python
allow_origins=["http://your-frontend-url"],
```

## Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 8080
- [ ] CORS enabled in backend
- [ ] No errors in browser console
- [ ] Can navigate to login page
- [ ] Can register new user
- [ ] Can login
- [ ] Can see dashboard
- [ ] Can create todos
- [ ] Can edit/delete todos

## Database

The backend uses PostgreSQL by default. Make sure it's running:

```bash
# For macOS with Homebrew
brew services start postgresql

# Verify connection
psql -U hsmadhusudhan -d TodoApplicationDatabase
```

**Database credentials** (from `database.py`):

```
User: hsmadhusudhan
Host: localhost
Port: 5432
Database: TodoApplicationDatabase
```

## Troubleshooting

### Frontend shows "API Request Error"

- [ ] Check backend is running: `curl http://localhost:8000/healthy`
- [ ] Check API_BASE_URL is correct in `api.js`
- [ ] Check browser console for CORS errors
- [ ] Ensure CORS middleware is added to `main.py`

### Can't login after registration

- [ ] Check database is running
- [ ] Verify user was created (check DB)
- [ ] Try exact username/password you registered with
- [ ] Check backend console for error messages

### Todos not loading

- [ ] Check token is stored: `localStorage.getItem('access_token')`
- [ ] Verify backend returns data: `curl -H "Authorization: Bearer <token>" http://localhost:8000/`
- [ ] Check network tab in DevTools for 401/403 errors

### Page keeps redirecting to login

- [ ] Check localStorage: `localStorage.getItem('access_token')`
- [ ] Login again to refresh token
- [ ] Clear localStorage and try again

## Project Structure

```
Todo_app/
├── TodoApp_FastAPI/           # Backend
│   ├── main.py               # FastAPI app (with CORS)
│   ├── models.py             # SQLAlchemy models
│   ├── database.py           # DB connection
│   └── routers/
│       ├── auth.py           # Authentication
│       ├── todos.py          # Todo CRUD
│       ├── users.py          # User management
│       └── admin.py          # Admin functions
│
└── frontend/                 # Frontend (✨ NEW)
    ├── index.html           # Login/Register page
    ├── dashboard.html       # Todo dashboard
    ├── css/
    │   └── style.css        # All styling
    └── js/
        ├── api.js           # API client
        ├── auth.js          # Auth handlers
        └── todos.js         # Todo handlers
```

## Next Steps

1.  Create an account
2.  Add your first todo
3.  Try filtering and sorting
4.  Toggle completion status
5.  Edit a todo
6.  Delete a todo
7.  Logout and login again

## Documentation

- Frontend: `frontend/README_FRONTEND.md`
- Backend: Check original project README

---
