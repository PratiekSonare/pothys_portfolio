# DNS Configuration for ecom.engineeringmonke.space

## Step 1: Configure DNS Records
Go to your domain registrar (where you bought engineeringmonke.space) and add an A record:

**Type**: A
**Host/Name**: ecom
**Value/Points to**: 3.109.78.224
**TTL**: 3600 (or Auto)

This will make `ecom.engineeringmonke.space` point to your Elastic IP.

---

## Step 2: Install Nginx on EC2

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@3.109.78.224

# Update packages
sudo apt update

# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## Step 3: Configure Nginx

```bash
# Copy the nginx.conf to EC2 (from your local machine)
scp -i your-key.pem nginx.conf ubuntu@3.109.78.224:~/

# On EC2, move it to sites-available
sudo mv ~/nginx.conf /etc/nginx/sites-available/ecom.engineeringmonke.space

# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/ecom.engineeringmonke.space /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t
```

---

## Step 4: Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (this will auto-configure nginx)
sudo certbot --nginx -d ecom.engineeringmonke.space

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (select Yes/2)

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Step 5: Update EC2 Security Group

Make sure these ports are open in your EC2 Security Group:

| Type  | Protocol | Port Range | Source    | Description           |
|-------|----------|------------|-----------|-----------------------|
| HTTP  | TCP      | 80         | 0.0.0.0/0 | HTTP traffic          |
| HTTPS | TCP      | 443        | 0.0.0.0/0 | HTTPS traffic         |
| SSH   | TCP      | 22         | Your IP   | SSH access            |

**Remove or close ports 3000 and 5000** from public access since Nginx will proxy to them internally.

---

## Step 6: Deploy Your Application

1. **Rebuild your Next.js app locally** (with updated .env):
```bash
npm run build
```

2. **Copy files to EC2**:
```bash
# Copy standalone build
scp -i your-key.pem -r build_out/standalone/* ubuntu@3.109.78.224:~/app/

# Copy static files
scp -i your-key.pem -r build_out/static ubuntu@3.109.78.224:~/app/.next/

# Copy backend
scp -i your-key.pem -r backend ubuntu@3.109.78.224:~/

# Copy .env
scp -i your-key.pem .env ubuntu@3.109.78.224:~/backend/
```

3. **On EC2, start the services with PM2**:
```bash
# Install dependencies if needed
cd ~/backend && npm install
cd ~/app && npm install

# Start backend
cd ~/backend
pm2 start server.js --name backend

# Start frontend
cd ~/app
pm2 start server.js --name frontend

# Save PM2 configuration
pm2 save
pm2 startup
```

4. **Restart Nginx**:
```bash
sudo systemctl restart nginx
```

---

## Step 7: Verify Deployment

1. Wait 5-10 minutes for DNS propagation
2. Visit `https://ecom.engineeringmonke.space`
3. Check browser console for any errors
4. Test API calls to verify backend connection

### Troubleshooting Commands:

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/ecom.engineeringmonke.space.error.log
sudo tail -f /var/log/nginx/ecom.engineeringmonke.space.access.log

# Check PM2 status
pm2 status
pm2 logs frontend
pm2 logs backend

# Check if services are listening
sudo netstat -tulpn | grep -E ':(3000|5000|80|443)'

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Notes:

- DNS propagation can take up to 48 hours but usually happens within 5-10 minutes
- The SSL certificate from Let's Encrypt is valid for 90 days and auto-renews
- Certbot will automatically update your nginx.conf with SSL certificate paths
- Since you're using nginx as a reverse proxy, your app only needs to listen on localhost:3000 and localhost:5000
- The NEXT_PUBLIC_BACKEND_LINK should now use `/api` path (relative) since nginx handles routing
