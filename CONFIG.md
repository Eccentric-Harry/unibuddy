# Configuration Management

This project uses environment-specific configuration files that contain sensitive information like database credentials, API keys, and secrets. These files are **NOT** committed to git for security reasons.

## Quick Setup

Run the setup script to create your local configuration files:

```bash
./setup-config.sh
```

## Manual Setup

### Backend Configuration

1. Copy the example configuration file:
   ```bash
   cp backend/src/main/resources/application-example.properties backend/src/main/resources/application.properties
   ```

2. Edit `backend/src/main/resources/application.properties` with your actual values:
   - Database connection details
   - JWT secret key (generate a secure random key)
   - Email configuration
   - Supabase keys (if using Supabase)

### Frontend Configuration

1. Copy the example environment file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Review and update `frontend/.env` if needed (usually works as-is for local development)

## Security Notes

- **Never commit** `application.properties` or `.env` files to git
- Use strong, unique passwords and secrets
- Generate a secure JWT secret key (at least 256 bits)
- Keep your credentials secure and don't share them

## Files to Configure

### Backend
- `backend/src/main/resources/application.properties` - Main configuration file
- Contains database credentials, JWT secrets, email settings

### Frontend
- `frontend/.env` - Environment variables
- Contains API URLs and app configuration

## Environment Variables Guide

### JWT Secret Generation
Generate a secure JWT secret using:
```bash
# Using openssl
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### Database Setup
Make sure your PostgreSQL database is running and accessible with the credentials you provide in `application.properties`.

## Troubleshooting

- If you see "configuration file not found" errors, run `./setup-config.sh`
- If authentication fails, check your JWT secret configuration
- If database connection fails, verify your database credentials and connection string
