#!/bin/bash

echo "🌤️  Weather Data Scraper Setup"
echo "================================"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file. Please update MongoDB URI if needed."
fi
cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Start MongoDB: docker run -d -p 27017:27017 --name mongodb mongo:latest"
echo "  2. Start backend: cd backend && source venv/bin/activate && python run.py"
echo "  3. Start frontend: cd frontend && npm run dev"
echo ""

