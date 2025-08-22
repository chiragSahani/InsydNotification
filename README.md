# Insyd Notifications POC

A proof-of-concept notification system for Insyd, optimized for ~100 DAUs with a clear path to scale to 1M+ users.

## 🏗️ Architecture

This is a monorepo containing:

- **Web App** (`apps/web`) - React + Vite + TypeScript + Socket.IO
- **API Server** (`apps/api`) - Node.js + Express + TypeScript + MongoDB  
- **Background Worker** (`apps/worker`) - BullMQ + Redis for event processing
- **Shared Types** (`packages/types`) - Common TypeScript definitions

## 📋 Link to System Design

📖 **[Complete System Design Document](./docs/system-design.md)**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- pnpm installed globally

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Create `.env` files in each app directory:

**apps/api/.env:**
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/insyd-notifications
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:5173
SOCKET_PUBLIC_URL=http://localhost:4000
```

**apps/worker/.env:**
```
MONGO_URI=mongodb://localhost:27017/insyd-notifications
REDIS_URL=redis://localhost:6379
```

**apps/web/.env:**
```
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

### 3. Seed Demo Data

```bash
pnpm seed
```

### 4. Start All Services

```bash
pnpm dev
```

This starts:
- Web app: http://localhost:5173
- API server: http://localhost:4000
- Background worker: (no HTTP interface)

## 🎯 How to Test

1. Open http://localhost:5173
2. Select a demo user from the dropdown
3. Use the Actions panel to:
   - Create posts
   - Follow other users
   - Like/comment on posts
4. Watch real-time notifications appear in the right panel
5. Mark notifications as read
6. Test with multiple browser tabs (different users)

## 🔗 Links

### Repositories
- Frontend: [Placeholder - Deploy to separate repo if needed]
- Backend API: [Placeholder - Same monorepo]
- Worker: [Placeholder - Same monorepo]

### Deployments
- **Web App**: [Placeholder - Deploy to Vercel/Netlify]
- **API Server**: [Placeholder - Deploy to Render/Railway/Fly]
- **Documentation**: [System Design Document](./docs/system-design.md)

## 📁 Project Structure

```
insyd-notifications-poc/
├── apps/
│   ├── web/          # React frontend
│   ├── api/          # Express API server
│   └── worker/       # Background job processor
├── packages/
│   └── types/        # Shared TypeScript types
├── docs/
│   └── system-design.md
└── README.md
```

## 🧪 Testing

Run all tests:
```bash
pnpm test
```

Run tests for specific app:
```bash
pnpm --filter api test
pnpm --filter worker test
pnpm --filter web test
```

## 🛠️ Available Commands

- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all applications
- `pnpm start` - Start production builds
- `pnpm seed` - Seed database with demo data
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm clean` - Clean all build artifacts

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check Atlas connection string
- Verify MONGO_URI in .env files
- Check network connectivity and credentials

### Redis Connection Issues
- For local Redis: `redis-server` or check if running on port 6379
- For Upstash: verify REDIS_URL format includes credentials
- Test connection: `redis-cli ping`

### Socket.IO Not Working
- Verify SOCKET_PUBLIC_URL matches your API server URL
- Check CORS_ORIGIN allows your frontend origin
- Ensure API server is running before frontend

### Port Conflicts
- API default: 4000, Web default: 5173
- Change PORT in .env files if conflicts occur
- Update corresponding URLs in other .env files

## 🎯 Non-Goals (Out of Scope for POC)

- Authentication & authorization
- Email/push notification delivery
- Advanced analytics & metrics  
- Production monitoring & observability
- GDPR compliance features
- Advanced notification preferences
- Multi-tenancy
- Caching layers
- Rate limiting
- Advanced security measures

## 🔮 Future Roadmap

- Replace Socket.IO with WebPush for production
- Implement notification batching and collapsing
- Add comprehensive auth system
- Scale worker with Kafka/PubSub
- Add notification preference center
- Implement digest/summary notifications
- Add analytics and monitoring
- Multi-region deployment

---

**Built for Insyd** - Social platform for Architecture professionals