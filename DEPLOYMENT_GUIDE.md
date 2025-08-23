# Insyd Notifications - Local Development & Deployment Guide

This guide covers how to run the project locally and deploy it to production (Render for backend, Netlify for frontend).

## 🏗️ Project Architecture

- **Frontend**: React + Vite + TypeScript + Socket.IO (Port 5173)
- **Backend API**: Node.js + Express + TypeScript + MongoDB + Socket.IO (Port 4000)
- **Worker**: Background job processor with BullMQ + Redis
- **Database**: MongoDB
- **Queue**: Redis

---

## 🚀 Local Development Setup

### Prerequisites

Make sure you have the following installed:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **pnpm** - Install with `npm install -g pnpm`
- **MongoDB** - [Local installation](https://docs.mongodb.com/manual/installation/) or [MongoDB Atlas](https://cloud.mongodb.com/)
- **Redis** - [Local installation](https://redis.io/download) or [Upstash Redis](https://upstash.com/redis)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd InsydNotification

# Install all dependencies
pnpm install
```

### Step 2: Environment Configuration

Create `.env` files in each service directory:

#### **Root `.env` (optional - for shared config)**
```env
# Database
MONGO_URI=mongodb://localhost:27017/insyd-notifications

# Redis
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### **`apps/api/.env`**
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/insyd-notifications

# Redis Queue
REDIS_URL=redis://localhost:6379

# CORS & Socket.IO
CORS_ORIGIN=http://localhost:5173
SOCKET_PUBLIC_URL=http://localhost:4000
```

#### **`apps/worker/.env`**
```env
# Database
MONGO_URI=mongodb://localhost:27017/insyd-notifications

# Redis Queue
REDIS_URL=redis://localhost:6379

# Socket.IO
SOCKET_PUBLIC_URL=http://localhost:4000
```

#### **`apps/web/.env`**
```env
# API Configuration
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

### Step 3: Start Local Services

#### Option A: Start All Services Together
```bash
# Start all services in development mode
pnpm dev
```

This will start:
- 🌐 **Web App**: http://localhost:5173
- 🚀 **API Server**: http://localhost:4000
- 🔄 **Background Worker**: (runs in background)

#### Option B: Start Services Individually
```bash
# Terminal 1 - API Server
pnpm --filter api dev

# Terminal 2 - Background Worker
pnpm --filter worker dev

# Terminal 3 - Web Frontend
pnpm --filter web dev
```

### Step 4: Seed Demo Data (Optional)

```bash
# Populate database with sample users and data
pnpm seed
```

### Step 5: Test the Application

1. Open http://localhost:5173 in your browser
2. Select a demo user from the dropdown
3. Use the Actions panel to:
   - Create posts
   - Follow other users
   - Like/comment on posts
4. Watch real-time notifications appear in the right panel
5. Test with multiple browser tabs (different users)

### Development Commands

```bash
# Build all applications
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Clean build artifacts
pnpm clean
```

---

## 🌐 Production Deployment

### Backend Deployment to Render

#### Step 1: Prepare for Render

1. **Create a `render.yaml` file in project root:**

```yaml
services:
  # API Service
  - type: web
    name: insyd-notifications-api
    env: node
    plan: starter
    buildCommand: pnpm install && pnpm --filter api build
    startCommand: pnpm --filter api start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 4000
      - key: MONGO_URI
        fromDatabase:
          name: insyd-mongodb
          property: connectionString
      - key: REDIS_URL
        fromDatabase:
          name: insyd-redis
          property: connectionString
      - key: CORS_ORIGIN
        value: https://your-app-name.netlify.app
      - key: SOCKET_PUBLIC_URL
        sync: false

  # Worker Service
  - type: worker
    name: insyd-notifications-worker
    env: node
    plan: starter
    buildCommand: pnpm install && pnpm --filter worker build
    startCommand: pnpm --filter worker start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        fromDatabase:
          name: insyd-mongodb
          property: connectionString
      - key: REDIS_URL
        fromDatabase:
          name: insyd-redis
          property: connectionString
      - key: SOCKET_PUBLIC_URL
        sync: false

databases:
  - name: insyd-mongodb
    databaseName: insyd-notifications
    plan: starter
  
  - name: insyd-redis
    plan: starter
```

#### Step 2: Deploy to Render

1. **Push your code to GitHub**:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

2. **Create Render Account**:
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy Services**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` and create all services

4. **Configure Environment Variables**:
   - Go to each service dashboard
   - Update `SOCKET_PUBLIC_URL` to your API service URL
   - Update `CORS_ORIGIN` to your Netlify app URL

#### Step 3: Manual Service Creation (Alternative)

If you prefer manual setup:

1. **Create MongoDB Database**:
   - New → Database → MongoDB
   - Plan: Starter (free)
   - Database Name: `insyd-notifications`

2. **Create Redis Database**:
   - New → Database → Redis
   - Plan: Starter (free)

3. **Create API Web Service**:
   - New → Web Service
   - Connect GitHub repo
   - Build Command: `pnpm install && pnpm --filter api build`
   - Start Command: `pnpm --filter api start`
   - Environment Variables:
     ```
     NODE_ENV=production
     PORT=4000
     MONGO_URI=[your-mongodb-connection-string]
     REDIS_URL=[your-redis-connection-string]
     CORS_ORIGIN=https://your-app-name.netlify.app
     SOCKET_PUBLIC_URL=[your-api-service-url]
     ```

4. **Create Worker Service**:
   - New → Background Worker
   - Same repo, different service
   - Build Command: `pnpm install && pnpm --filter worker build`
   - Start Command: `pnpm --filter worker start`
   - Same environment variables as API

### Frontend Deployment to Netlify

#### Step 1: Build Configuration

1. **Create `netlify.toml` in project root:**

```toml
[build]
  base = "apps/web"
  command = "pnpm install && pnpm --filter web build"
  publish = "apps/web/dist"

[build.environment]
  NODE_VERSION = "18"
  PNPM_VERSION = "8.15.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Environment Variables

Create production environment file `apps/web/.env.production`:

```env
VITE_API_URL=https://your-render-api-service.onrender.com
VITE_SOCKET_URL=https://your-render-api-service.onrender.com
```

#### Step 3: Deploy to Netlify

1. **Option A: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=apps/web/dist
```

2. **Option B: Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - "Add new site" → "Import from Git"
   - Connect GitHub repository
   - Build settings:
     - Base directory: `apps/web`
     - Build command: `pnpm install && pnpm --filter web build`
     - Publish directory: `apps/web/dist`
   - Environment variables:
     ```
     VITE_API_URL=https://your-render-api-service.onrender.com
     VITE_SOCKET_URL=https://your-render-api-service.onrender.com
     ```

#### Step 4: Update CORS Configuration

After Netlify deployment:
1. Get your Netlify app URL (e.g., `https://your-app-name.netlify.app`)
2. Update `CORS_ORIGIN` environment variable in your Render API service
3. Restart the Render services

---

## 🔧 Production Configuration Checklist

### Database Setup
- [ ] MongoDB Atlas cluster created (or local MongoDB for development)
- [ ] Database user with read/write permissions
- [ ] Network access configured (allow connections from Render IPs)

### Redis Setup  
- [ ] Redis instance created (Upstash, Redis Labs, or Render Redis)
- [ ] Connection string obtained

### Environment Variables
- [ ] All `.env` files configured correctly
- [ ] Production URLs updated in environment variables
- [ ] CORS origins properly configured

### Deployment
- [ ] Backend API deployed to Render
- [ ] Background worker deployed to Render
- [ ] Frontend deployed to Netlify
- [ ] All services can communicate with each other

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```bash
# Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/database-name

# Test connection
mongosh "your-connection-string"
```

#### Redis Connection Issues
```bash
# Test Redis connection
redis-cli -u "your-redis-url" ping
```

#### CORS Errors
- Ensure `CORS_ORIGIN` in API matches your frontend URL exactly
- Check browser developer tools for specific CORS error messages

#### Socket.IO Connection Issues
- Verify `SOCKET_PUBLIC_URL` is accessible from your frontend
- Check browser network tab for WebSocket connection attempts
- Ensure ports 4000 (HTTP) and 4001 (WebSocket) are accessible

#### Build Failures
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

### Health Check Endpoints

- **API Health**: `GET /api/healthz`
- **Database Status**: Check MongoDB connection logs
- **Queue Status**: Check Redis connection logs

---

## 📊 Monitoring & Logs

### Development
```bash
# View API logs
pnpm --filter api dev

# View Worker logs  
pnpm --filter worker dev

# View build logs
pnpm build
```

### Production
- **Render**: Check service logs in Render dashboard
- **Netlify**: Check function logs and deploy logs in Netlify dashboard
- **MongoDB**: Use MongoDB Atlas monitoring
- **Redis**: Use Redis provider monitoring tools

---

## 🚀 Next Steps

After successful deployment:

1. **Set up monitoring**: Add error tracking (Sentry) and analytics
2. **Configure CI/CD**: Set up automatic deployments on git push
3. **Add authentication**: Implement user authentication system
4. **Scale infrastructure**: Monitor usage and scale services as needed
5. **Add more features**: Email notifications, push notifications, etc.

---

## 📞 Support

If you encounter issues:
1. Check this troubleshooting section
2. Review service logs for error messages
3. Verify all environment variables are set correctly
4. Test local development setup first before debugging production

Happy coding! 🎉