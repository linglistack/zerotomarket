#!/bin/bash

echo "🚀 Setting up ZeroToMarket AgentKit Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
    cat > .env << EOF
# Clarifai API
CLARIFAI_PAT=your_clarifai_pat_token_here

# Apify API  
APIFY_API_TOKEN=your_apify_api_token_here

# Server Configuration
PORT=8000
AGENTKIT_PORT=3010
NODE_ENV=development

# Inngest (for local dev server integration)
INNGEST_EVENT_KEY=dummy_key_for_local_dev
INNGEST_SIGNING_KEY=dummy_signing_key_for_local_dev
EOF
    echo "⚠️  Please update .env with your actual API keys!"
else
    echo "✅ .env file already exists"
fi

# Build the project
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "🤖 To start with AgentKit debugging:"
echo "   Terminal 1: npm run dev"
echo "   Terminal 2: npx inngest-cli@latest dev -u http://localhost:3010"
echo ""
echo "📡 API will be available at: http://localhost:8000"
echo "🤖 AgentKit server at: http://localhost:3010"
echo "📊 Inngest Dev UI at: http://localhost:8288 (if running)"
echo ""
echo "⚠️  Don't forget to update your API keys in .env!" 