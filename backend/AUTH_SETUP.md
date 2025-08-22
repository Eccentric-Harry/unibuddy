# College Buddy - Authentication Setup

## Overview
This document provides setup instructions for the College Buddy authentication system using Spring Boot, PostgreSQL, and JWT tokens.

## Prerequisites
- Java 24
- Maven 3.6+
- PostgreSQL 12+
- SMTP email account (Gmail recommended for development)

## Database Setup

### 1. Install PostgreSQL
```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb collegebuddy
```

### 2. Configure Database Connection
Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/collegebuddy
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Email Configuration

### 1. Gmail Setup (Development)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

### 2. Update Email Configuration
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-generated-app-password
```

## Security Configuration

### JWT Secret
The application uses a Base64-encoded JWT secret. For production, generate a new secure key:
```bash
openssl rand -base64 64
```

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "securePassword123",
  "year": 2024
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@college.edu",
  "password": "securePassword123"
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Verify Email
```
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

#### Resend Verification Email
```
POST /api/auth/resend-verification?email=john@college.edu
```

#### Logout
```
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### User Management Endpoints

#### Get Current User Profile
```
GET /api/users/me
Authorization: Bearer your-access-token
```

#### Update Profile
```
PUT /api/users/me
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "My bio",
  "year": 2025,
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

#### Get User by ID
```
GET /api/users/{userId}
Authorization: Bearer your-access-token
```

### College Endpoints

#### Get All Colleges
```
GET /api/colleges
Authorization: Bearer your-access-token
```

#### Get College by ID
```
GET /api/colleges/{collegeId}
Authorization: Bearer your-access-token
```

#### Get College by Domain
```
GET /api/colleges/domain/{domain}
Authorization: Bearer your-access-token
```

## Running the Application

### 1. Build the Project
```bash
mvn clean compile
```

### 2. Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

### 3. Test Health Endpoint
```bash
curl http://localhost:8080/api/health
```

## Authentication Flow

### 1. User Registration
1. User submits registration form with college email
2. System extracts domain from email and finds/creates college
3. User account created with `emailVerified = false`
4. Verification email sent with token
5. Access and refresh tokens returned immediately

### 2. Email Verification
1. User clicks verification link from email
2. System validates token and marks email as verified
3. User account becomes fully active

### 3. Login
1. User submits credentials
2. System validates email/password
3. Access and refresh tokens returned
4. User must have verified email to login successfully

### 4. Token Refresh
1. When access token expires, frontend uses refresh token
2. System validates refresh token
3. New access and refresh tokens returned

## Security Features

- **Password Hashing**: BCrypt with salt
- **JWT Tokens**: Secure token-based authentication
- **Email Verification**: Required for account activation
- **Refresh Tokens**: Secure token renewal
- **CORS Configuration**: Configurable cross-origin requests
- **Input Validation**: Server-side validation for all requests
- **Error Handling**: Comprehensive error responses

## Database Schema

The system creates the following tables:
- `colleges`: College information and domains
- `users`: User accounts and profiles
- `refresh_tokens`: JWT refresh token storage

## Development Notes

### Testing Authentication
Use tools like Postman or curl to test the API endpoints. Always include the `Authorization: Bearer <token>` header for protected endpoints.

### Email Testing
For development, you can check the application logs to see the verification URLs instead of setting up actual email delivery.

### Database Migrations
The application uses Hibernate's `ddl-auto=update` for automatic schema updates during development. For production, consider using Flyway or Liquibase for proper database migrations.

## Next Steps

After setting up authentication, you can proceed to implement:
1. Real-time chat functionality
2. Marketplace features
3. Job postings
4. Tutoring system
5. College information board

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials in application.properties

2. **Email Not Sending**
   - Verify Gmail app password
   - Check firewall settings for SMTP port 587

3. **JWT Token Issues**
   - Ensure JWT secret is properly Base64 encoded
   - Check token expiration times

4. **CORS Errors**
   - Update CORS configuration in SecurityConfig
   - Ensure frontend URL is correctly configured
