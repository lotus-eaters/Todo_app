# API Contract Documentation

## Base URL

```
http://localhost:8000
```

## Authentication

All endpoints (except `/auth/` and `/auth/token`) require Bearer token in header:

```
Authorization: Bearer <access_token>
```

Token is obtained from login and valid for 20 minutes.

---

## 📝 Endpoints Reference

### AUTH ENDPOINTS

#### 1. Register User

```
POST /auth/
Content-Type: application/json

Request Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepass123",
  "role": "user",
  "phone_number": "+1234567890"
}

Response: 201 Created
(Returns user object or empty on success)
```

#### 2. Login

```
POST /auth/token
Content-Type: application/x-www-form-urlencoded

Request Body:
{
  "username": "john_doe",
  "password": "securepass123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### 3. Get Current User

```
GET /user/
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "role": "user",
  "phone_number": "+1234567890"
}
```

#### 4. Change Password

```
PUT /user/password
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "password": "oldpassword123",
  "new_password": "newpassword123"
}

Response: 204 No Content
```

#### 5. Change Phone Number

```
PUT /user/phonenumber/{phone_number}
Authorization: Bearer <token>

Request Parameters:
- phone_number: "+9876543210" (path parameter)

Response: 204 No Content
```

---

### TODO ENDPOINTS (User)

#### 1. Get All User's Todos

```
GET /
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "priority": 3,
    "complete": false,
    "owner_id": 1
  },
  ...
]
```

#### 2. Get Specific Todo

```
GET /todo/{todo_id}
Authorization: Bearer <token>

Request Parameters:
- todo_id: 1 (path parameter, must be > 0)

Response: 200 OK
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "priority": 3,
  "complete": false,
  "owner_id": 1
}

Error: 404 Not Found (if todo doesn't exist or not owned by user)
```

#### 3. Create Todo

```
POST /todo
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "priority": 3,
  "complete": false
}

Validation Rules:
- title: min_length = 3
- description: min_length = 2
- priority: 1 <= priority <= 5
- complete: boolean

Response: 201 Created
(Returns created todo object)
```

#### 4. Update Todo

```
PUT /todo/{todo_id}
Authorization: Bearer <token>
Content-Type: application/json

Request Parameters:
- todo_id: 1 (path parameter, must be > 0)

Request Body:
{
  "title": "Buy groceries updated",
  "description": "Milk, bread, eggs, butter",
  "priority": 2,
  "complete": false
}

Response: 204 No Content

Error: 404 Not Found (if todo doesn't exist or not owned by user)
```

#### 5. Delete Todo

```
DELETE /todo/{todo_id}
Authorization: Bearer <token>

Request Parameters:
- todo_id: 1 (path parameter, must be > 0)

Response: 204 No Content

Error: 404 Not Found (if todo doesn't exist or not owned by user)
```

---

### ADMIN ENDPOINTS

#### 1. Get All Todos (Admin Only)

```
GET /admin/todo
Authorization: Bearer <admin_token>
(Note: user must have role="admin")

Response: 200 OK
[
  {
    "id": 1,
    "title": "...",
    "description": "...",
    "priority": 3,
    "complete": false,
    "owner_id": 1
  },
  ...
]

Error: 401 Unauthorized (if user is not admin)
```

#### 2. Delete Any Todo (Admin Only)

```
DELETE /admin/todo/{todo_id}
Authorization: Bearer <admin_token>
(Note: user must have role="admin")

Request Parameters:
- todo_id: 1 (path parameter, must be > 0)

Response: 204 No Content

Error: 401 Unauthorized (if user is not admin)
Error: 404 Not Found (if todo doesn't exist)
```

---

## Data Models

### User Model

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "hashed_password": "bcrypt_hash",
  "is_active": true,
  "role": "user|admin",
  "phone_number": "+1234567890"
}
```

### Todo Model

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "priority": 1-5,
  "complete": false,
  "owner_id": 1
}
```

### JWT Payload

```json
{
  "sub": "john_doe",
  "id": 1,
  "role": "user",
  "exp": 1710867890
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Validation error details"
}
```

### 401 Unauthorized

```json
{
  "detail": "Could not validate user."
}
```

### 404 Not Found

```json
{
  "detail": "Todo not found"
}
```

### 409 Conflict

```json
{
  "detail": "User already exists"
}
```

---

## 🔍 Status Codes

| Code | Meaning      | Usage                    |
| ---- | ------------ | ------------------------ |
| 200  | OK           | GET requests successful  |
| 201  | Created      | POST requests successful |
| 204  | No Content   | PUT/DELETE successful    |
| 400  | Bad Request  | Invalid input            |
| 401  | Unauthorized | Missing/invalid token    |
| 404  | Not Found    | Resource doesn't exist   |
| 409  | Conflict     | Resource already exists  |

---

## Usage Examples

### JavaScript (using fetch)

```javascript
// Register
const register = await fetch("http://localhost:8000/auth/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "john",
    email: "john@example.com",
    first_name: "John",
    last_name: "Doe",
    password: "pass123",
    role: "user",
    phone_number: "+1234567890",
  }),
});

// Login
const login = await fetch("http://localhost:8000/auth/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    username: "john",
    password: "pass123",
  }),
});
const data = await login.json();
const token = data.access_token;

// Get todos
const todos = await fetch("http://localhost:8000/", {
  headers: { Authorization: `Bearer ${token}` },
});

// Create todo
const created = await fetch("http://localhost:8000/todo", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Learn FastAPI",
    description: "Study FastAPI fundamentals",
    priority: 3,
    complete: false,
  }),
});

// Update todo
const updated = await fetch("http://localhost:8000/todo/1", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Learn FastAPI",
    description: "Study FastAPI advanced topics",
    priority: 2,
    complete: true,
  }),
});

// Delete todo
const deleted = await fetch("http://localhost:8000/todo/1", {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Security Notes

1. **Password**: Minimum 6 characters, hashed with bcrypt
2. **Token**: Valid for 20 minutes, includes user ID and role
3. **Database**: PostgreSQL with proper constraints
4. **Input Validation**: All inputs validated at model level
5. **Rate Limiting**: Consider adding for production
6. **HTTPS**: Use HTTPS in production

---

## Testing with cURL

```bash
# Health check
curl http://localhost:8000/healthy

# Register
curl -X POST http://localhost:8000/auth/ \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "first_name":"Test",
    "last_name":"User",
    "password":"testpass123",
    "role":"user",
    "phone_number":"+1234567890"
  }'

# Login
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpass123"

# Get todos (replace TOKEN with actual token)
curl http://localhost:8000/ \
  -H "Authorization: Bearer TOKEN"

# Create todo
curl -X POST http://localhost:8000/todo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title":"Sample Todo",
    "description":"A sample task",
    "priority":3,
    "complete":false
  }'
```

---

**Last Updated**: March 2026  
**API Version**: 1.0.0
