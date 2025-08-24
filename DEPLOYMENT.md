# 🚀 Deployment Guide

This guide covers deploying the InsydNotification system to various cloud platforms.

## 📋 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Render Deployment](#-render-deployment)
- [Alternative Platforms](#-alternative-platforms)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Troubleshooting](#-troubleshooting)

## 🎯 Overview

The InsydNotification system consists of 3 services that need to be deployed:

1. **API Service** - Web service (Express.js + Socket.IO)
2. **Worker Service** - Background worker (BullMQ processor)
3. **Frontend** - Static site (React SPA)

## 📋 Prerequisites

- GitHub repository with your code
- MongoDB database (MongoDB Atlas recommended)
- Redis instance (Upstash or Render Redis recommended)
- Domain name (optional)

## 🌐 Render Deployment (Recommended)

### Step 1: Deploy API Service

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure settings:

```
Name: insyd-notifications-api
Runtime: Node
Region: Oregon (US West)
Branch: master
Root Directory: (leave empty)

Build Command:
pnpm install --frozen-lockfile && cd packages/types && pnpm build && cd ../../apps/api && pnpm build

Start Command:
pnpm --filter api start

Instance Type: Starter ($7/month)
```

4. Add environment variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insyd
REDIS_URL=redis://username:password@host:port
JWT_SECRET=your-random-jwt-secret-here
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

### Step 2: Deploy Worker Service

1. Render Dashboard → **New** → **Background Worker**
2. Same repository, configure settings:

```
Name: insyd-notifications-worker
Runtime: Node
Region: Oregon (US West)
Branch: master
Root Directory: (leave empty)

Build Command:
pnpm install --frozen-lockfile && cd packages/types && pnpm build && cd ../../apps/worker && pnpm build

Start Command:
pnpm --filter worker start

Instance Type: Starter ($7/month)
```

3. Add environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insyd
REDIS_URL=redis://username:password@host:port
```

### Step 3: Deploy Frontend

1. Render Dashboard → **New** → **Static Site**
2. Same repository, configure settings:

```
Name: insyd-notifications-web
Branch: master
Root Directory: (leave empty)

Build Command:
pnpm install --frozen-lockfile && pnpm --filter web build

Publish Directory:
apps/web/dist

Instance Type: Free
```

3. Add environment variables:

```env
VITE_API_URL=https://insyd-notifications-api.onrender.com
VITE_SOCKET_URL=https://insyd-notifications-api.onrender.com
```

### Step 4: Setup Databases on Render

**Redis:**
1. Render Dashboard → **New** → **Redis**
2. Name: `insyd-redis`
3. Plan: Free
4. Copy the connection URL to your environment variables

## 🌍 Alternative Platforms

### Railway

1. Connect GitHub repository
2. Deploy each app as separate service
3. Use Railway's database add-ons

### Vercel + Railway Combo

- **Frontend**: Deploy to Vercel (excellent for React apps)
- **Backend**: Deploy API + Worker to Railway
- **Databases**: Use Railway PostgreSQL + Redis add-ons

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure multiple services in one app
3. Use DigitalOcean Managed Databases

### Heroku

1. Create 3 separate Heroku apps
2. Use Heroku Postgres and Redis add-ons
3. Configure environment variables

## 🔧 Environment Variables

### Required for API Service

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@host/database
REDIS_URL=redis://user:pass@host:port
JWT_SECRET=your-secure-random-string
CORS_ORIGIN=https://your-frontend-domain.com
```

### Required for Worker Service

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@host/database
REDIS_URL=redis://user:pass@host:port
```

### Required for Frontend

```env
VITE_API_URL=https://your-api-domain.com
VITE_SOCKET_URL=https://your-api-domain.com
```

## 🗄️ Database Setup

### MongoDB Atlas (Free Tier)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist your IP (or 0.0.0.0/0 for all IPs)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/insyd-notifications
   ```

### Redis Setup

**Option 1: Upstash (Free Tier)**
1. Go to [upstash.com](https://upstash.com)
2. Create free Redis database
3. Get connection string:
   ```
   redis://default:password@host:port
   ```

**Option 2: Render Redis**
1. In Render dashboard → New → Redis
2. Free plan available
3. Copy provided connection URL

## 🚨 Troubleshooting

### Build Failures

**Issue**: TypeScript build errors
**Solution**: Ensure all environment variables are set and types package builds first

```bash
# Correct build order
cd packages/types && pnpm build
cd apps/api && pnpm build
cd apps/worker && pnpm build
cd apps/web && pnpm build
```

### Database Connection Issues

**Issue**: MongoDB connection timeout
**Solutions**:
- Check connection string format
- Verify IP whitelist includes your deployment platform
- Ensure database user has proper permissions

**Issue**: Redis connection failed
**Solutions**:
- Verify Redis URL includes username/password
- Check if Redis instance is running
- Confirm firewall settings

### WebSocket Issues

**Issue**: Real-time notifications not working
**Solutions**:
- Ensure CORS_ORIGIN matches your frontend domain exactly
- Check Socket.IO client connects to correct API URL
- Verify WebSocket connections aren't blocked by proxy

### Memory/Performance Issues

**Issue**: Services crashing or slow performance
**Solutions**:
- Upgrade to higher instance types (Starter → Standard)
- Enable horizontal scaling if available
- Monitor memory usage and optimize queries

## 🔄 CI/CD Setup

### Automatic Deployment

Most platforms support automatic deployment from GitHub:

1. **Connect Repository**: Link your GitHub repo
2. **Set Branch**: Usually `main` or `master`
3. **Auto-Deploy**: Enable auto-deploy on push
4. **Build Logs**: Monitor deployment in platform dashboard

### Manual Deployment

If you prefer manual deployments:

1. Push changes to GitHub
2. Go to platform dashboard
3. Click "Deploy" or "Redeploy"
4. Monitor build logs

## 📊 Monitoring

### Health Checks

Add basic health check endpoints:

```javascript
// In your API
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});
```

### Logging

Most platforms provide built-in logging:
- **Render**: View logs in service dashboard
- **Railway**: Real-time logs in project view
- **Vercel**: Function logs for serverless deployments

## 💰 Cost Estimation

### Render (Recommended for beginners)
- API Service: $7/month (Starter)
- Worker Service: $7/month (Starter)
- Frontend: Free (Static Site)
- Redis: Free tier available
- **Total**: ~$14/month + database costs

### Railway
- Services: ~$5-10/month each
- Databases: ~$5/month each
- **Total**: ~$15-25/month

### Vercel + Railway
- Vercel Frontend: Free (hobby plan)
- Railway Backend: ~$10-15/month
- **Total**: ~$10-15/month

## 🏁 Final Steps

After deployment:

1. **Test all endpoints** using the API documentation
2. **Verify WebSocket connections** work in production  
3. **Test notification flow** end-to-end
4. **Monitor logs** for any errors
5. **Set up domain** (optional) for custom URLs

---

**Need help?** Check the troubleshooting section or create an issue in the repository.