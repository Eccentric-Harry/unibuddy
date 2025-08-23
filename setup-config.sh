#!/bin/bash

# Configuration Setup Script for UniBuddy
# This script helps new developers set up their local configuration files

echo "🚀 Setting up UniBuddy configuration files..."

# Backend configuration
BACKEND_CONFIG_DIR="backend/src/main/resources"
BACKEND_CONFIG_FILE="$BACKEND_CONFIG_DIR/application.properties"
BACKEND_EXAMPLE_FILE="$BACKEND_CONFIG_DIR/application-example.properties"

# Frontend configuration
FRONTEND_CONFIG_FILE="frontend/.env"
FRONTEND_EXAMPLE_FILE="frontend/.env.example"

# Check if backend config exists
if [ ! -f "$BACKEND_CONFIG_FILE" ]; then
    echo "📝 Creating backend configuration file..."
    if [ -f "$BACKEND_EXAMPLE_FILE" ]; then
        cp "$BACKEND_EXAMPLE_FILE" "$BACKEND_CONFIG_FILE"
        echo "✅ Created $BACKEND_CONFIG_FILE from example"
        echo "⚠️  Please edit $BACKEND_CONFIG_FILE with your actual configuration values"
    else
        echo "❌ Example file $BACKEND_EXAMPLE_FILE not found"
    fi
else
    echo "ℹ️  Backend configuration file already exists: $BACKEND_CONFIG_FILE"
fi

# Check if frontend config exists
if [ ! -f "$FRONTEND_CONFIG_FILE" ]; then
    echo "📝 Creating frontend configuration file..."
    if [ -f "$FRONTEND_EXAMPLE_FILE" ]; then
        cp "$FRONTEND_EXAMPLE_FILE" "$FRONTEND_CONFIG_FILE"
        echo "✅ Created $FRONTEND_CONFIG_FILE from example"
        echo "ℹ️  Frontend configuration is mostly ready to use"
    else
        echo "❌ Example file $FRONTEND_EXAMPLE_FILE not found"
    fi
else
    echo "ℹ️  Frontend configuration file already exists: $FRONTEND_CONFIG_FILE"
fi

echo ""
echo "🔧 Configuration Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit $BACKEND_CONFIG_FILE with your actual:"
echo "   - Database credentials"
echo "   - JWT secret (generate a secure random key)"
echo "   - Email credentials"
echo "   - Supabase keys (if applicable)"
echo ""
echo "2. Review $FRONTEND_CONFIG_FILE and update if needed"
echo ""
echo "⚠️  SECURITY REMINDER:"
echo "   - Never commit sensitive configuration files to git"
echo "   - Use strong, unique passwords and secrets"
echo "   - Keep your credentials secure"
echo ""
