# Hosting Guide - Payslip Generator

Complete guide for deploying the Payslip Generator to production.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Backend Deployment (Railway)](#backend-deployment-railway)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables](#environment-variables)
6. [Testing Deployment](#testing-deployment)
7. [Common Issues](#common-issues)
8. [Single-Server Deployment](#single-server-deployment-optional)

---

## Quick Start

**Recommended Stack:**
- **Frontend**: Vercel (free tier, automatic deployments)
- **Backend**: Render or Railway (free tier available)

**Deployment Order:**
1. Deploy backend first → Get backend URL
2. Deploy frontend with backend URL as environment variable

---

## Backend Deployment (Render)

### Step 1: Prepare Repository

Ensure your code is pushed to GitHub/GitLab/Bitbucket.

### Step 2: Create New Web Service

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your repository
4. Select the repository containing your payslip app

### Step 3: Configure Service

**Basic Settings:**
- **Name**: `payslip-backend` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Instance Type:**
- Select **Free** tier (or paid if needed)

### Step 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (add after frontend deployment) |

**Note:** `PORT` is automatically set by Render.

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes first time)
3. Copy your backend URL: `https://payslip-backend-xxxx.onrender.com`

### Step 6: Test Backend

Visit: `https://your-backend-url.onrender.com/health`

Expected response:
```json
{
  "status": "ok",
  "environment": "production",
  "timestamp": "2026-01-18T10:00:00.000Z"
}
```

---

## Backend Deployment (Railway)

### Step 1: Create New Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

### Step 2: Configure Service

Railway auto-detects Node.js. If not:

**Settings:**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Step 3: Environment Variables

Go to **Variables** tab:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-app.vercel.app` |

### Step 4: Deploy

1. Railway auto-deploys on push
2. Copy your backend URL from **Settings** → **Domains**
3. Format: `https://payslip-backend-production.up.railway.app`

### Step 5: Test

Visit: `https://your-backend-url/health`

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository

Ensure frontend code is pushed to GitHub/GitLab/Bitbucket.

### Step 2: Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your repository
4. Vercel auto-detects Next.js

### Step 3: Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `frontend`

**Build Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `.next` (auto-filled)
- Install Command: `npm install` (auto-filled)

### Step 4: Environment Variables

Click **"Environment Variables"**

Add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_BASE` | `https://your-backend-url.onrender.com` |

**Important:** Use your actual backend URL from Render/Railway.

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

### Step 6: Update Backend CORS

Go back to your backend (Render/Railway) and update `FRONTEND_URL`:

**Render:**
- Dashboard → Your Service → Environment → Edit `FRONTEND_URL`
- Set to: `https://your-app.vercel.app`
- Click **"Save Changes"** (triggers redeploy)

**Railway:**
- Project → Variables → Edit `FRONTEND_URL`
- Set to: `https://your-app.vercel.app`
- Redeploys automatically

---

## Environment Variables

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Server port (auto-set by platform) |
| `NODE_ENV` | Yes | `development` | Set to `production` |
| `FRONTEND_URL` | Yes | `http://localhost:3000` | Your Vercel frontend URL |

### Frontend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_BASE` | Yes | `http://localhost:3001` | Your backend URL (Render/Railway) |

---

## Testing Deployment

### 1. Test Backend Health

```bash
curl https://your-backend-url.onrender.com/health
```

Expected:
```json
{
  "status": "ok",
  "environment": "production",
  "timestamp": "..."
}
```

### 2. Test Frontend

1. Visit: `https://your-app.vercel.app`
2. Go to **Settings** page
3. Fill in organization details
4. Click **"Save Settings"**
5. Verify success message appears

### 3. Test PDF Generation

1. Go to home page
2. Fill in payslip details
3. Click **"Export PDF"**
4. Verify PDF downloads successfully
5. Open PDF and verify content matches preview

### 4. Check Browser Console

Open DevTools (F12) → Console

**No errors should appear**

Common success indicators:
- ✅ No CORS errors
- ✅ No 404 errors
- ✅ "Loaded settings:" log appears
- ✅ PDF downloads without errors

---

## Common Issues

### Issue 1: CORS Error

**Error:**
```
Access to fetch at 'https://backend...' from origin 'https://frontend...' 
has been blocked by CORS policy
```

**Solution:**
1. Check backend `FRONTEND_URL` environment variable
2. Ensure it matches your Vercel URL exactly (including `https://`)
3. No trailing slash in URL
4. Redeploy backend after changing env vars

**Verify:**
```bash
# Check backend logs for allowed origins
```

---

### Issue 2: PDF Generation Fails

**Error:**
```
Failed to generate PDF
```

**Possible Causes:**

**A. Puppeteer Missing Dependencies (Render)**

**Solution:**
Add buildpack in Render dashboard:
1. Go to your service → **Environment**
2. Scroll to **Build Command**
3. Update to:
   ```bash
   npm install && npm run build
   ```

**B. Timeout (Free Tier)**

Free tier services may timeout on first request (cold start).

**Solution:**
- Wait 30 seconds and try again
- Consider upgrading to paid tier for instant responses

**C. Memory Limit**

Puppeteer requires ~512MB RAM.

**Solution:**
- Upgrade to paid tier with more memory
- Or use Puppeteer Core with external Chrome

---

### Issue 3: 502 Bad Gateway

**Error:**
```
502 Bad Gateway
```

**Causes:**
1. Backend not running
2. Backend crashed during startup
3. Wrong backend URL in frontend

**Solution:**

**Check Backend Logs:**
- Render: Dashboard → Logs
- Railway: Project → Deployments → Logs

**Look for:**
```
✅ Backend server running on port 3001
```

If not present, check for errors in logs.

**Common Fixes:**
- Ensure `package.json` scripts are correct
- Verify `dist/index.js` exists after build
- Check TypeScript compilation errors

---

### Issue 4: Environment Variables Not Working

**Error:**
```
Cannot read property 'NEXT_PUBLIC_API_BASE' of undefined
```

**Solution:**

**Frontend (Vercel):**
1. Variables must start with `NEXT_PUBLIC_`
2. Redeploy after adding env vars
3. Clear browser cache

**Backend (Render/Railway):**
1. Check variable names (case-sensitive)
2. Redeploy after changes
3. Verify in logs: `Environment: production`

---

### Issue 5: Settings Not Saving

**Error:**
Settings don't persist after page refresh

**Cause:**
localStorage works differently in production

**Solution:**
1. Check browser console for errors
2. Ensure HTTPS (not HTTP) - some browsers block localStorage on HTTP
3. Clear browser cache and cookies
4. Try incognito mode

---

## Single-Server Deployment (Optional)

For deploying both frontend and backend on a single VPS (DigitalOcean, Linode, AWS EC2).

### Prerequisites

- Ubuntu 20.04+ server
- Domain name (optional but recommended)
- SSH access

### Step 1: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### Step 2: Clone Repository

```bash
cd /var/www
git clone https://github.com/your-username/payslip.git
cd payslip
```

### Step 3: Setup Backend

```bash
cd backend
npm install
npm run build

# Create .env file
cat > .env << EOF
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://your-domain.com
EOF

# Start with PM2
pm2 start dist/index.js --name payslip-backend
pm2 save
pm2 startup
```

### Step 4: Setup Frontend

```bash
cd ../frontend
npm install

# Create .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_BASE=http://your-domain.com:3001
EOF

npm run build

# Start with PM2
pm2 start npm --name payslip-frontend -- start
pm2 save
```

### Step 5: Configure Nginx

```bash
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/payslip
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend Health
    location /health {
        proxy_pass http://localhost:3001;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/payslip /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL with Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Monitoring

### Check Service Status

**PM2:**
```bash
pm2 status
pm2 logs payslip-backend
pm2 logs payslip-frontend
```

**Render/Railway:**
- Check dashboard logs
- Set up log drains (paid feature)

### Health Checks

Set up monitoring with:
- UptimeRobot (free)
- Pingdom
- Better Uptime

Monitor: `https://your-backend-url/health`

---

## Backup & Recovery

### Database

No database used - all data in localStorage (client-side).

### Logo Files

Logos stored as base64 in localStorage. No server-side backup needed.

### Code

Ensure Git repository is up to date:
```bash
git push origin main
```

---

## Scaling Considerations

### Current Architecture

- **Stateless**: No sessions, no database
- **Horizontal Scaling**: ✅ Can run multiple backend instances
- **CDN**: ✅ Vercel provides global CDN for frontend

### Future Enhancements

If you need to scale:
1. Add Redis for session management
2. Use S3 for logo storage (instead of base64)
3. Add database for payslip history
4. Implement caching for PDF generation

---

## Support

For issues:
1. Check [Common Issues](#common-issues) section
2. Review platform-specific documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Render Docs](https://render.com/docs)
   - [Railway Docs](https://docs.railway.app)
3. Check browser console and server logs

---

## Summary Checklist

**Before Deployment:**
- [ ] Code pushed to Git repository
- [ ] `.env.example` files present
- [ ] Build succeeds locally (`npm run build`)

**Backend Deployment:**
- [ ] Service created on Render/Railway
- [ ] Environment variables set
- [ ] `/health` endpoint returns 200 OK
- [ ] Backend URL copied

**Frontend Deployment:**
- [ ] Project imported to Vercel
- [ ] `NEXT_PUBLIC_API_BASE` set to backend URL
- [ ] Build succeeds
- [ ] Frontend URL copied

**Post-Deployment:**
- [ ] Update backend `FRONTEND_URL` with Vercel URL
- [ ] Test settings save
- [ ] Test PDF export
- [ ] No CORS errors in console
- [ ] PDF downloads successfully

**Done!** 🎉 Your Payslip Generator is now live in production.
