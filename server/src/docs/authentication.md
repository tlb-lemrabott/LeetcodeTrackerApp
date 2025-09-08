# JWT Authentication and Authorization System

## Overview

The LeetcodeTracker application now includes a comprehensive JWT-based authentication and authorization system with role-based access control. The system supports two user roles: **USER** and **ADMIN**, each with different permissions and capabilities.

## User Roles and Permissions

### USER Role
- **Dashboard Access**: Personal dashboard with their own problems
- **Problem Management**: Create, read, update, delete their own problems
- **Export Functionality**: Export their problems to Excel/PDF
- **Restrictions**: Cannot access bulk upload features

### ADMIN Role
- **All USER permissions** plus:
- **Bulk Upload**: Access to bulk upload and JSON file import features
- **User Management**: View all users and their progress statistics
- **System Statistics**: Access to system-wide statistics

## Authentication Endpoints

### 1. Signup (Unified Endpoint)
```
POST /api/v1/auth/signup
```

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "role": "string (optional, USER or ADMIN, defaults to USER)"
}
```

**Examples:**

**User Signup (default):**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Admin Signup:**
```json
{
  "username": "admin_user",
  "email": "admin@example.com",
  "password": "adminPassword123",
  "role": "ADMIN"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "userId": "uuid",
    "username": "string",
    "email": "string",
    "role": "USER|ADMIN"
  }
}
```

### 2. Login
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "token": "jwt_token_string",
  "user": {
    "userId": "uuid",
    "username": "string",
    "email": "string",
    "role": "USER|ADMIN"
  }
}
```

## Authorization

### JWT Token Usage
Include the JWT token in the Authorization header for all protected endpoints:

```
Authorization: Bearer <jwt_token>
```

### Protected Endpoints

#### User Endpoints (Requires Authentication)
- `GET /problems` - Get user's problems
- `POST /problems` - Create a problem
- `GET /problems/{id}` - Get specific problem
- `PUT /problems/{id}` - Update problem
- `DELETE /problems/{id}` - Delete problem
- `GET /problems/export/excel` - Export to Excel
- `GET /problems/export/pdf` - Export to PDF

#### Admin-Only Endpoints (Requires ADMIN Role)
- `POST /problems/upload-list` - Bulk upload problems
- `POST /problems/import-json` - Import from JSON file
- `GET /admin/users` - Get all users with statistics
- `GET /admin/users/{userId}/problems` - Get specific user's problems
- `GET /admin/stats` - Get system statistics

## Admin Dashboard Features

### User Management
The admin can view all users in the system with their progress statistics:

**Endpoint:** `GET /admin/users`

**Response:**
```json
[
  {
    "userId": "uuid",
    "username": "string",
    "email": "string",
    "role": "USER|ADMIN",
    "progress": {
      "total": 15,
      "todo": 5,
      "doing": 3,
      "done": 7
    }
  }
]
```

### System Statistics
**Endpoint:** `GET /admin/stats`

**Response:**
```json
{
  "totalUsers": 25,
  "totalProblems": 150,
  "problemStats": {
    "todo": 45,
    "doing": 30,
    "done": 75
  }
}
```

## Security Features

### Password Security
- Passwords are encrypted using BCrypt
- Minimum security requirements enforced

### JWT Security
- Tokens expire after 24 hours (configurable)
- Secure secret key for token signing
- Stateless authentication

### Role-Based Access Control
- Method-level security annotations
- Automatic role checking
- Granular permission control

## Usage Examples

### User Registration and Login
```bash
# Signup a new user
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepassword123"
  }'
```

### Creating Problems (User)
```bash
curl -X POST http://localhost:8080/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "problemName": "Two Sum",
    "comment": "Classic problem",
    "link": "https://leetcode.com/problems/two-sum/",
    "status": "TODO",
    "level": "EASY"
  }'
```

### Admin Bulk Upload
```bash
curl -X POST http://localhost:8080/problems/upload-list \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -d '[
    {
      "problemName": "Problem 1",
      "comment": "Bulk upload",
      "link": "https://leetcode.com/problems/problem1/",
      "status": "TODO",
      "level": "EASY"
    }
  ]'
```

### Admin User Management
```bash
# Get all users with statistics
curl -X GET http://localhost:8080/admin/users \
  -H "Authorization: Bearer <admin_jwt_token>"

# Get system statistics
curl -X GET http://localhost:8080/admin/stats \
  -H "Authorization: Bearer <admin_jwt_token>"
```

## Error Handling

### Authentication Errors
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: Insufficient permissions for the role

### Common Error Responses
```json
{
  "error": "Unauthorized",
  "message": "Access denied. Please provide a valid token.",
  "status": 401
}
```

## Configuration

### JWT Settings (application.properties)
```properties
jwt.secret=mySecretKeyForJWTTokenGenerationAndValidationInLeetcodeTrackerApplication
jwt.expiration=86400000
```

### Database Schema
The system automatically creates the following tables:
- `users` - User accounts with roles
- `problems` - Problems linked to users
- Foreign key relationship between problems and users

## Testing

A comprehensive test script is provided (`test-auth.sh`) that tests:
- User and admin signup
- Login functionality
- Problem creation and management
- Role-based access control
- Admin features
- Error handling

Run the test script:
```bash
./test-auth.sh
```

## Migration Notes

### Existing Data
- Existing problems will need to be migrated to link with users
- Consider creating a default admin user for initial setup

### Database Changes
- New `users` table with authentication fields
- Updated `problems` table with user foreign key
- Automatic schema updates via Hibernate

## Security Best Practices

1. **Token Storage**: Store JWT tokens securely (httpOnly cookies recommended for web apps)
2. **Password Policy**: Implement strong password requirements
3. **Rate Limiting**: Consider implementing rate limiting for auth endpoints
4. **HTTPS**: Always use HTTPS in production
5. **Token Rotation**: Consider implementing token refresh mechanism
6. **Audit Logging**: Log authentication and authorization events

## Future Enhancements

- Password reset functionality
- Email verification
- Two-factor authentication
- Token refresh mechanism
- User profile management
- Advanced admin analytics
