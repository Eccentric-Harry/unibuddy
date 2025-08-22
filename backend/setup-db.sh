#!/bin/bash

# College Buddy Database Setup Script

echo "🎓 College Buddy Database Setup"
echo "==============================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   On macOS: brew install postgresql"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL."
    echo "   On macOS: brew services start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database
echo "📝 Creating database 'collegebuddy'..."
createdb collegebuddy 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database 'collegebuddy' created successfully"
else
    echo "⚠️  Database 'collegebuddy' might already exist or there was an error"
fi

# Create user (optional)
echo ""
read -p "Do you want to create a dedicated database user? (y/n): " create_user

if [[ $create_user == "y" || $create_user == "Y" ]]; then
    read -p "Enter username: " username
    read -s -p "Enter password: " password
    echo ""
    
    psql -d postgres -c "CREATE USER $username WITH PASSWORD '$password';" 2>/dev/null
    psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE collegebuddy TO $username;" 2>/dev/null
    
    echo "✅ User '$username' created and granted privileges"
    echo ""
    echo "📋 Update your application.properties with:"
    echo "   spring.datasource.username=$username"
    echo "   spring.datasource.password=$password"
fi

echo ""
echo "🚀 Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Update src/main/resources/application.properties with your database credentials"
echo "2. Configure email settings in application.properties"
echo "3. Run: mvn spring-boot:run"
echo ""
echo "📖 See AUTH_SETUP.md for detailed configuration instructions"
