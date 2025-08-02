#!/bin/bash

echo "🚀 Stellaiir Waitlist - Automated Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating environment configuration..."
    cat > .env.local << EOF
# hCaptcha Configuration (already configured)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=91324b5c-45c0-4d2a-a5fa-7eb8bf6a1340

# Email Configuration (optional - for production)
# RESEND_API_KEY=your_resend_api_key_here
# FROM_EMAIL=Stellaiir <noreply@stellaiir.com>
# ADMIN_EMAILS=admin@stellaiir.com

# Database Configuration (optional - for production)
# DATABASE_URL=your_database_url_here
EOF
    echo "✅ Environment file created"
else
    echo "ℹ️  Environment file already exists"
fi

# Build the project to check for errors
echo "🏗️  Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi

echo "✅ Build successful"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "📚 For more details, see SETUP.md"
echo ""
echo "🌟 Your Stellaiir waitlist is ready to go!"