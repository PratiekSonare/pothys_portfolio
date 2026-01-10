#!/bin/bash

# Deployment script for ecom.engineeringmonke.space
# Run this script from your local machine after making changes

set -e  # Exit on error

# Configuration
EC2_IP="3.109.78.224"
EC2_USER="ubuntu"
SSH_KEY="your-key.pem"  # UPDATE THIS with your actual key path
DOMAIN="ecom.engineermonke.space"

echo "🚀 Starting deployment to $DOMAIN ($EC2_IP)"
echo "================================================"

# Step 1: Build Next.js app
echo "📦 Building Next.js application..."
npm run build

# Step 2: Copy files to EC2
echo "📤 Copying files to EC2..."

# Copy standalone build
echo "  - Copying standalone build..."
scp -i $SSH_KEY -r build_out/standalone/* $EC2_USER@$EC2_IP:~/app/

# Copy static files
echo "  - Copying static files..."
scp -i $SSH_KEY -r build_out/static $EC2_USER@$EC2_IP:~/app/.next/

# Copy public files (if any)
if [ -d "public" ]; then
    echo "  - Copying public files..."
    scp -i $SSH_KEY -r public $EC2_USER@$EC2_IP:~/app/
fi

# Copy backend
echo "  - Copying backend..."
scp -i $SSH_KEY -r backend $EC2_USER@$EC2_IP:~/

# Copy .env
echo "  - Copying .env..."
scp -i $SSH_KEY .env $EC2_USER@$EC2_IP:~/backend/

# Step 3: Restart services on EC2
echo "🔄 Restarting services on EC2..."
ssh -i $SSH_KEY $EC2_USER@$EC2_IP << 'ENDSSH'
    # Install dependencies if needed
    cd ~/backend
    npm install --production
    
    cd ~/app
    npm install --production
    
    # Restart PM2 services
    pm2 restart backend || pm2 start ~/backend/server.js --name backend
    pm2 restart frontend || pm2 start ~/app/server.js --name frontend
    
    # Save PM2 configuration
    pm2 save
    
    # Show status
    pm2 status
ENDSSH

echo "✅ Deployment completed successfully!"
echo "================================================"
echo "🌐 Your app should be live at: https://$DOMAIN"
echo ""
echo "📊 To check logs:"
echo "   ssh -i $SSH_KEY $EC2_USER@$EC2_IP"
echo "   pm2 logs"
echo ""
echo "🔍 To check Nginx logs:"
echo "   sudo tail -f /var/log/nginx/$DOMAIN.error.log"
