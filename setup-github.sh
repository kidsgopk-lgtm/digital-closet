#!/bin/bash

# 🚀 Digital Closet Deployment Helper
# This script helps you deploy to GitHub step-by-step

echo ""
echo "🎨 Digital Closet Deployment Helper"
echo "=================================="
echo ""
echo "This script will help you:"
echo "  1. Initialize Git repository"
echo "  2. Add all your files"
echo "  3. Create first commit"
echo "  4. Show you what to do next"
echo ""
echo "Before running this, make sure:"
echo "  ✅ You have a GitHub account"
echo "  ✅ You created a repository called 'digital-closet'"
echo "  ✅ Your project works locally (bun run dev)"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "📋 Step 1: Initialize Git..."
if [ -d ".git" ]; then
    echo "   ℹ️  Git already initialized"
else
    git init
    echo "   ✅ Git initialized"
fi

echo ""
echo "📋 Step 2: Add all files..."
git add .
echo "   ✅ All files added"

echo ""
echo "📋 Step 3: Create initial commit..."
git commit -m "Digital Closet MVP - Initial deployment"
echo "   ✅ Commit created"

echo ""
echo "📋 Step 4: Set branch to main..."
git branch -M main
echo "   ✅ Branch set to main"

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo "✨ Git is ready! Now you need to push to GitHub."
echo ""
echo "NEXT STEPS (Important!):"
echo ""
echo "1️⃣  Go to your GitHub repository"
echo "    URL: https://github.com/YOUR_USERNAME/digital-closet"
echo ""
echo "2️⃣  Copy the repository URL from GitHub"
echo "    Click green 'Code' button → Copy HTTPS URL"
echo "    Should look like: https://github.com/username/digital-closet.git"
echo ""
echo "3️⃣  Come back here and run:"
echo ""
echo "    git remote add origin [PASTE_YOUR_REPO_URL_HERE]"
echo "    git push -u origin main"
echo ""
echo "4️⃣  Enter your GitHub username and password when asked"
echo "    Note: GitHub may require Personal Access Token"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📚 Need help? Read DEPLOYMENT_GUIDE.md for detailed steps"
echo ""
