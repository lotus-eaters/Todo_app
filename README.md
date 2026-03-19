# Todo_app

Todo list application, where the user can login, create and update a list of todos, set priorities and completion status.

FastAPI framework for Restful API endpoints
Pydantic validation Request and Response format
Path and Query Parameter validation
HTTP status response and error handling with HTTPExceptions
SQLAlchemy ORM with PostgreSQL DB with Users and Todos models
JWT for user authentication with OAuth2PasswordRequestForm, OAuth2PasswordBearer
CryptContext - bcrypt for hashing user password
Alembic data migration
Pytest for unit and integration tests

# Quick Reference Card

## File Locations

```
Todo_app/
├── frontend/                          # Frontend app
│   ├── index.html                    # Login/Register (START HERE)
│   ├── dashboard.html                # Todo dashboard
│   ├── css/style.css                 # All styling
│   └── js/
│       ├── api.js                    # API client
│       ├── auth.js                   # Auth handlers
│       └── todos.js                  # Todo handlers
│
├── TodoApp_FastAPI/                  # Backend (FastAPI)
│   ├── main.py                       # Main app (CORS enabled )
│   ├── models.py                     # DB models
│   ├── database.py                   # DB connection
│   ├── routers/
│   │   ├── auth.py                   # Auth endpoints
│   │   ├── todos.py                  # Todo endpoints
│   │   ├── users.py                  # User endpoints
│   │   └── admin.py                  # Admin endpoints
│   └── API_DOCUMENTATION.md          # API reference
│
├── QUICK_START.md                    #  Start here

```

---

## ⚡ Commands to Run

### Start Backend

```bash
cd TodoApp_FastAPI
python -m uvicorn main:app --reload --port 8000
```

### Start Frontend

```bash
cd frontend
python -m http.server 8080
```

### Access Application

```
http://localhost:8080/index.html
```

### View API Docs

```
http://localhost:8000/docs
```

---

## Key Credentials Structure

### Registration Form Fields

- Username (min 3 chars)
- Email (valid email)
- First Name
- Last Name
- Phone Number
- Password (min 6 chars)

### After Login

- Stored in localStorage:
  - `access_token` - JWT token
  - `token_type` - "bearer"
  - `user_info` - User object (JSON)

---

## API Endpoints Quick Ref

| Method | Endpoint         | Auth | Purpose                 |
| ------ | ---------------- | ---- | ----------------------- |
| POST   | /auth/           |      | Register user           |
| POST   | /auth/token      |      | Login                   |
| GET    | /user/           |      | Get current user        |
| GET    | /                |      | Get all todos           |
| POST   | /todo            |      | Create todo             |
| PUT    | /todo/{id}       |      | Update todo             |
| DELETE | /todo/{id}       |      | Delete todo             |
| GET    | /admin/todo      |      | Get all todos (admin)   |
| DELETE | /admin/todo/{id} |      | Delete any todo (admin) |

---

## Priority Levels

| Level    | Color       | Icon | Range   |
| -------- | ----------- | ---- | ------- |
| Low      | 🟢 Green    | 1    | #a3e635 |
| Medium   | 🟡 Yellow   | 2    | #84cc16 |
| High     | 🟠 Orange   | 3    | #f59e0b |
| Urgent   | 🔴 Red      | 4    | #f97316 |
| Critical | ⛔ Dark Red | 5    | #dc2626 |

---

## LocalStorage Keys

```javascript
localStorage.getItem("access_token"); // JWT token
localStorage.getItem("token_type"); // "bearer"
localStorage.getItem("user_info"); // User JSON

// Clear all
localStorage.clear();
```

---

## Todo Data Structure

```javascript
{
  id: 1,
  title: "Task name",
  description: "Task details",
  priority: 1-5,
  complete: true/false,
  owner_id: 1
}
```

---

## Test Scenarios

1. **Register** → Fill form → Submit → Switch to login
2. **Login** → Enter credentials → See dashboard
3. **Add Todo** → Fill form → See in list
4. **Filter** → Click filter button → List updates
5. **Sort** → Select sort option → List reorders
6. **Edit** → Click edit → Form populates → Update
7. **Complete** → Check checkbox → Visual change
8. **Delete** → Click delete → Confirm → Todo removed
9. **Logout** → Click logout → Redirected to login

---

## Features Checklist

- User authentication (register/login)
- JWT token management
- Create todos
- Edit todos
- Delete todos
- Complete todos
- Filter todos (4 options)
- Sort todos (4 options)
- Real-time statistics
- Responsive design
- Toast notifications
- Error handling
- Input validation
- Security (XSS, CSRF)

---

## Customize These

### Change API URL

**File**: `frontend/js/api.js` (Line 1)

```javascript
const API_BASE_URL = "http://new-backend-url:8000";
```

### Change Colors

**File**: `frontend/css/style.css` (Lines 10-25)

```css
:root {
  --primary-color: #your-color;
  /* ... other colors ... */
}
```

### Update CORS

**File**: `TodoApp_FastAPI/main.py` (Line 12)

```python
allow_origins=["http://your-frontend-url"],
```

## Debugging Tips

### Check if logged in

```javascript
// In browser console:
TokenManager.isAuthenticated();
TokenManager.getToken();
TokenManager.getUserInfo();
```

### View API requests

```
Open DevTools → Network tab → Check requests/responses
```

### View stored data

```
DevTools → Application → localStorage
```

### Check errors

```
DevTools → Console → Look for errors/warnings
```

## Pre-Launch Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 8080
- [ ] Can access http://localhost:8080/index.html
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create todos
- [ ] Can filter todos
- [ ] Can sort todos
- [ ] Can edit todos
- [ ] Can delete todos
- [ ] Responsive on mobile (F12 → Mobile view)
- [ ] No console errors
- [ ] No CORS errors
- [ ] Notifications working
- [ ] Logout works

---

## Common Errors & Solutions

| Error              | Solution                     |
| ------------------ | ---------------------------- |
| CORS error         | Enable CORS in main.py       |
| 404 not found      | Check API_BASE_URL in api.js |
| 401 unauthorized   | Login again or check token   |
| Network error      | Check backend is running     |
| localStorage full  | Clear and try again          |
| Styles not loading | Check css path, clear cache  |

---

## Key Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Authentication**: JWT tokens
- **Storage**: localStorage
- **Styling**: CSS Grid, Flexbox
- **Design**: Mobile-first, responsive
- **Backend**: FastAPI, Python
- **Database**: PostgreSQL
- **API**: REST, Bearer tokens

```bash
# Terminal 1: Backend
cd TodoApp_FastAPI
python -m uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
python -m http.server 8080

# Browser:
http://localhost:8080/index.html
```
