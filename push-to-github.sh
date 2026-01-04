#!/bin/bash

# 🚀 Push to GitHub - With Authentication
# This script helps you push to GitHub using a Personal Access Token

echo ""
echo "🔐 GitHub Authentication Setup"
echo "================================="
echo ""
echo "To push to GitHub, you need a Personal Access Token"
echo ""

# Check if token is provided as argument
if [ -z "$1" ]; then
    echo "❌ Error: No token provided"
    echo ""
    echo "📋 Usage:"
    echo "   ./push-to-github.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "🔑 How to get a token:"
    echo "   1. Go to: https://github.com/kidsgopk-lgtm/settings/tokens"
    echo "   2. Click 'Generate new token' (classic)"
    echo "   3. Name it: 'Digital Closet Deployment'"
    echo "   4. Check 'repo' scope"
    echo "   5. Click 'Generate token'"
    echo "   6. Copy the token!"
    echo ""
    exit 1
fi

TOKEN=$1
REPO_URL="https://github.com/kidsgopk-lgtm/digital-closet.git"

echo "✅ Token provided"
echo "📋 Repository: $REPO_URL"
echo ""

# Update remote URL with token
git remote set-url origin https://$TOKEN@github.com/kidsgopk-lgtm/digital-closet.git

echo "🚀 Pushing to GitHub..."
echo ""

# Push to GitHub
git push -u origin main

echo ""
echo "✅ Push complete!"
echo ""
echo "🔒 Security Tip: After pushing, you can:"
echo "   - Delete the token from GitHub for security"
echo "   - Or keep it for future pushes"
