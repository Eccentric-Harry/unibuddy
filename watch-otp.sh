#!/bin/bash

# Monitor OTP Codes from Backend Logs
# Run this in a separate terminal while testing registration

cd "$(dirname "$0")/backend"

echo "👀 Monitoring for OTP codes in backend logs..."
echo "   Press Ctrl+C to stop"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Follow the log file and highlight OTP lines
tail -f backend-console.log 2>/dev/null | grep --line-buffered -E "(OTP|Registration initiated|Verification Code)" || \
    echo "⚠️  Log file not found. Start the backend server first."

