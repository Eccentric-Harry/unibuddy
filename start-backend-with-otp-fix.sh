#!/bin/bash

# Quick Start Script for Backend after OTP Fix
# This script compiles and starts the backend server

cd "$(dirname "$0")/backend"

echo "🔧 Fixing OTP Email Registration Issue..."
echo ""
echo "Changes made:"
echo "  ✅ Fixed Gmail app password (removed spaces)"
echo "  ✅ Made email service non-blocking"
echo "  ✅ OTP now logged for development testing"
echo ""

# Kill any existing backend process
echo "🛑 Stopping existing backend processes..."
pkill -f "spring-boot" 2>/dev/null || true
pkill -f "collegeBuddy" 2>/dev/null || true
sleep 2

# Clean and compile
echo "🧹 Cleaning and compiling..."
./mvnw clean compile -q

if [ $? -eq 0 ]; then
    echo "✅ Compilation successful!"
    echo ""
    echo "🚀 Starting backend server..."
    echo "   Logs will be in: backend/backend-console.log"
    echo ""

    # Start the server in background
    nohup ./mvnw spring-boot:run > backend-console.log 2>&1 &

    echo "⏳ Waiting for server to start..."
    sleep 10

    # Check if server is running
    if ps aux | grep -v grep | grep -q "spring-boot\|collegeBuddy"; then
        echo "✅ Backend server started successfully!"
        echo ""
        echo "📝 IMPORTANT FOR TESTING:"
        echo "   When you register, check the console output for the OTP:"
        echo "   tail -f backend/backend-console.log | grep 'OTP:'"
        echo ""
        echo "   Example output:"
        echo "   Registration initiated for email: user@college.edu. OTP: 123456 (expires in 5 minutes)"
        echo ""
        echo "🌐 Backend running at: http://localhost:8080"
    else
        echo "❌ Failed to start server. Check backend/backend-console.log for errors"
        tail -20 backend/backend-console.log
    fi
else
    echo "❌ Compilation failed!"
    exit 1
fi

