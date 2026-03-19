# Todo App - Frontend Documentation

## 📋 Overview

This is a comprehensive frontend for the TodoApp FastAPI backend. It includes authentication (login/register), todo management with CRUD operations, filtering, sorting, and real-time statistics.

## 📁 Project Structure

```
frontend/
├── index.html          # Login & Register page
├── dashboard.html      # Main todo dashboard
├── css/
│   └── style.css       # All styles (1000+ lines)
└── js/
    ├── api.js          # API client, token manager, API endpoints
    ├── auth.js         # Authentication handlers
    └── todos.js        # Todo CRUD and filtering logic
```

## 🏗️ Architecture

### Layer 1: API Client (`js/api.js`)

- **TokenManager**: Manages authentication tokens and user info in localStorage
- **APIClient**: Base fetch wrapper with automatic authorization headers
- **AuthAPI**: Login, register, get user, change password, change phone
- **TodoAPI**: CRUD operations for todos
- **AdminAPI**: Admin-only endpoints

### Layer 2: Authentication (`js/auth.js`)

- Login handler with JWT token storage
- Registration handler
- Logout handler
- Form toggling between login/register
- Auto-redirect based on auth status
- Notification system

### Layer 3: Todo Management (`js/todos.js`)

- Load todos from backend
- Create new todos
- Edit existing todos
- Delete todos
- Toggle completion status
- Filter todos (all, active, completed, high-priority)
- Sort todos (newest, oldest, priority, title)
- Real-time statistics

## 🔄 Data Flow

### Registration Flow

```
Register Form → handleRegister() → AuthAPI.register()
→ POST /auth/ → Backend validation → Success → Show notification → Switch to login
```

### Login Flow

```
Login Form → handleLogin() → AuthAPI.login()
→ POST /auth/token → Get JWT token → Store token & user info
→ Get user details → Redirect to dashboard
```

### Todo Creation Flow

```
Add Todo Form → handleAddTodo() → TodoAPI.createTodo()
→ POST /todo → Create in DB → Load todos → Render todos
```

### Todo Update Flow

```
Edit Todo → editTodo() → Populate form → updateTodo()
→ PUT /todo/{id} → Update in DB → Load todos → Render todos
```

## 🎨 Styling Features

- **Responsive Design**: Mobile-first approach, optimized for all screen sizes
- **Dark/Light Support**: CSS variables for easy theming
- **Animations**: Smooth transitions and loading states
- **Priority Colors**: Visual indicators for task priority
- **Accessibility**: Proper form labels, ARIA attributes, keyboard navigation

### Color Scheme

- Primary: `#3b82f6` (Blue)
- Success: `#10b981` (Green)
- Error: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)
- Info: `#0ea5e9` (Cyan)

## 🔐 Authentication System

### Token Storage

- Access token stored in localStorage
- User info stored as JSON in localStorage
- Automatic token inclusion in all API requests

### Security Features

- 401 Unauthorized handling (redirects to login)
- XSS prevention (HTML escaping)
- CSRF protection (tokens in headers)
- Password validation (min 6 chars)

### JWT Payload

```json
{
  "sub": "username",
  "id": 1,
  "role": "user|admin",
  "exp": 1234567890
}
```

## 📊 Todo Data Model

```javascript
{
  id: 1,
  title: "Sample Todo",
  description: "This is a sample todo",
  priority: 3,           // 1-5 (Low to Critical)
  complete: false,
  owner_id: 1
}
```

### Priority Levels

1. 🟢 Low
2. 🟡 Medium
3. 🟠 High
4. 🔴 Urgent
5. ⛔ Critical

## Getting Started

### Prerequisites

- Backend running on `http://localhost:8000`
- Modern browser (Chrome, Firefox, Safari, Edge)

### Setup

1. **Ensure CORS is enabled in backend** (already added to `main.py`):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Update API_BASE_URL if needed** in `js/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8000"; // Change if backend is elsewhere
```

3. **Serve frontend files** using a simple HTTP server:

```bash
# Using Python
python -m http.server 8080

# Or using Node.js
npx http-server -p 8080

# Or using any web server (Nginx, Apache, etc.)
```

4. **Access the app**:
   - Navigate to `http://localhost:8080/index.html`
   - Or create a `.htaccess` or server config to serve `index.html` as default

## 🔌 API Endpoints Used

### Authentication

- `POST /auth/` - Register new user
- `POST /auth/token` - Login (OAuth2 form data)
- `GET /user/` - Get current user info
- `PUT /user/password` - Change password
- `PUT /user/phonenumber/{phone_number}` - Update phone number

### Todos (User)

- `GET /` - Get all user's todos
- `GET /todo/{todo_id}` - Get specific todo
- `POST /todo` - Create new todo
- `PUT /todo/{todo_id}` - Update todo
- `DELETE /todo/{todo_id}` - Delete todo

### Todos (Admin)

- `GET /admin/todo` - Get all todos (admin only)
- `DELETE /admin/todo/{todo_id}` - Delete any todo (admin only)

## 🛠️ Key Features

### Implemented

- [x] User registration with validation
- [x] User login with JWT
- [x] Secure token storage
- [x] Todo CRUD operations
- [x] Real-time todo filtering
- [x] Todo sorting (5 options)
- [x] Priority levels with visual indicators
- [x] Todo completion toggle
- [x] User dashboard with stats
- [x] Responsive mobile design
- [x] Auto-logout on token expiry
- [x] Error handling & notifications
- [x] HTML escaping (XSS prevention)

### 📋 Future Enhancements

- [ ] Due dates for todos
- [ ] Recurring todos
- [ ] Todo categories/tags
- [ ] Sharing todos with other users
- [ ] Dark theme toggle
- [ ] Offline support (Service Workers)
- [ ] Push notifications
- [ ] Export todos (CSV, PDF)
- [ ] Bulk operations
- [ ] Undo/Redo functionality

## 🐛 Troubleshooting

### Issue: "API Request Error" / Network Error

**Solution**: Ensure backend is running and CORS is enabled

```bash
# Check if backend is running
curl http://localhost:8000/healthy
```

### Issue: "Could not validate user" during login

**Solution**: Check that username/password are correct and user exists

### Issue: Tokens not being sent to backend

**Solution**: Ensure `Authorization: Bearer <token>` header is present (check browser DevTools)

### Issue: CORS errors in console

**Solution**: Update CORS settings in `main.py` to allow your frontend URL:

```python
allow_origins=["http://localhost:8080", "http://example.com"]
```

## 📝 Code Examples

### Creating a Todo

```javascript
const todoData = {
  title: "Buy groceries",
  description: "Milk, bread, eggs",
  priority: 3,
  complete: false,
};
await TodoAPI.createTodo(todoData);
```

### Filtering Todos

```javascript
filterTodos("high-priority"); // Shows only priority 4-5 todos
filterTodos("active"); // Shows incomplete todos
filterTodos("completed"); // Shows completed todos
```

### Checking Authentication

```javascript
if (TokenManager.isAuthenticated()) {
  console.log("User is logged in");
}
```

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (Full grid layout)
- **Tablet**: 768px - 1199px (Adjusted grid)
- **Mobile**: < 768px (Single column)
- **Small Mobile**: < 480px (Optimized touch targets)

## 🔒 Security Considerations

1. **HTTPS**: Use HTTPS in production
2. **Token Expiry**: Tokens expire after 20 minutes (backend setting)
3. **XSS Prevention**: All user input is escaped before rendering
4. **CSRF**: Using bearer token authentication (no cookies)
5. **Content Security Policy**: Recommended to add CSP headers

## 📞 Support

For issues or questions about the frontend:

1. Check the browser console for errors
2. Check the network tab for API responses
3. Verify backend is running and responding
4. Check localStorage for token presence

---

**Frontend Version**: 1.0.0  
**Last Updated**: March 2026  
**Compatible Backend**: FastAPI TodoApp
