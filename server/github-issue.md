# 🚀 Feature Request: Implement JWT Authentication and Authorization System

## Description
Implement a comprehensive JWT-based authentication and authorization system with role-based access control for the LeetcodeTracker application.

## Requirements

### Authentication System
- [ ] JWT token-based authentication
- [ ] User registration and login endpoints
- [ ] Password encryption using BCrypt
- [ ] Token expiration and validation
- [ ] Stateless authentication

### User Roles & Permissions
- [ ] **USER Role**: Personal dashboard, CRUD operations on own problems, export functionality
- [ ] **ADMIN Role**: All USER permissions + bulk upload features + user management

### Admin Dashboard Features
- [ ] View all users with usernames and emails
- [ ] Track user progress statistics (TODO, DOING, DONE counts)
- [ ] View total problems per user
- [ ] Access individual user's problem lists
- [ ] System-wide statistics

### Access Control
- [ ] Restrict bulk upload (`/problems/upload-list`) to ADMIN only
- [ ] Restrict JSON file import (`/problems/import-json`) to ADMIN only
- [ ] Restrict admin endpoints (`/admin/**`) to ADMIN only
- [ ] User can only access their own problems

### Database Changes
- [ ] Create `users` table with authentication fields
- [ ] Update `problems` table with user foreign key relationship
- [ ] Implement proper database schema migration

## Technical Implementation

### New Components
- [ ] `User` entity with Spring Security integration
- [ ] `UserRole` enum (USER, ADMIN)
- [ ] JWT utility class for token management
- [ ] Authentication service and controller
- [ ] Spring Security configuration
- [ ] Admin controller for user management
- [ ] Updated Problem entity with user relationships

### Security Features
- [ ] Method-level security annotations
- [ ] Role-based access control
- [ ] Comprehensive error handling
- [ ] Secure JWT secret configuration

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signup/admin` - Admin registration  
- `POST /auth/login` - User login

### Admin Management
- `GET /admin/users` - List all users with statistics
- `GET /admin/users/{userId}/problems` - Get user's problems
- `GET /admin/stats` - System statistics

### Protected Endpoints
- All `/problems/**` endpoints require authentication
- Bulk upload endpoints require ADMIN role

## Acceptance Criteria
- [ ] Users can register and login with JWT tokens
- [ ] USER role can only access their own problems
- [ ] ADMIN role can access all features including bulk upload
- [ ] Admin dashboard shows user statistics and progress
- [ ] Proper error handling for unauthorized access
- [ ] Database schema supports user-problem relationships
- [ ] Comprehensive documentation provided

## Testing
- [ ] Unit tests for authentication service
- [ ] Integration tests for role-based access control
- [ ] End-to-end tests for admin dashboard
- [ ] Security tests for unauthorized access attempts

## Documentation
- [ ] API documentation for authentication endpoints
- [ ] User role and permission documentation
- [ ] Admin dashboard usage guide
- [ ] Security best practices guide

## Priority
**High** - This is a core security feature that enables multi-user support and administrative capabilities.

## Labels
`enhancement`, `security`, `authentication`, `authorization`, `admin-dashboard`, `jwt`

## Implementation Details

### Database Schema Changes
```sql
-- New users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    account_non_expired BOOLEAN DEFAULT TRUE,
    account_non_locked BOOLEAN DEFAULT TRUE,
    credentials_non_expired BOOLEAN DEFAULT TRUE
);

-- Updated problems table
ALTER TABLE problem ADD COLUMN user_id UUID;
ALTER TABLE problem ADD CONSTRAINT fk_problem_user 
    FOREIGN KEY (user_id) REFERENCES users(user_id);
```

### JWT Configuration
```properties
# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000
```

### Security Configuration
- Spring Security with JWT authentication
- Method-level security with `@PreAuthorize`
- CORS configuration for frontend integration
- Password encryption with BCrypt

## Example Usage

### User Registration
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Admin User Creation
```bash
curl -X POST http://localhost:8080/auth/signup/admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Authenticated Request
```bash
curl -X GET http://localhost:8080/problems \
  -H "Authorization: Bearer <jwt_token>"
```

## Related Issues
- None

## Additional Notes
- This implementation will require a database migration for existing data
- Consider implementing password reset functionality in future iterations
- JWT tokens should be stored securely on the client side
- Consider implementing token refresh mechanism for better UX
