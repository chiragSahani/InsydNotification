# 🔔 InsydNotification - Real-time Notification System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

A **production-ready, scalable real-time notification system** built with modern microservices architecture. This project demonstrates enterprise-level development practices, event-driven architecture, and real-time communication.

## 🚀 Live Demo

- **🌐 Frontend Application:** [https://insyd-notifications-web.onrender.com](https://insyd-notifications-web.onrender.com)
- **🔗 API Documentation:** [View API Docs](./API_DOCS.md)
- **📋 Project Demo Guide:** [View Demo](./DEMO.md)
- **💻 Source Code:** [GitHub Repository](https://github.com/chiragSahani/InsydNotification)

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#️-architecture)
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Development](#️-development)

## 🎯 Overview

InsydNotification is a comprehensive notification system that handles real-time user interactions, social media features, and event-driven notifications. The system is designed to scale horizontally and handle thousands of concurrent users with reliable message delivery.

### Key Highlights

- ✅ **Microservices Architecture** - Independently deployable services
- ✅ **Real-time Communication** - WebSocket-based instant notifications
- ✅ **Event-Driven Design** - Asynchronous processing with message queues
- ✅ **Type Safety** - Full TypeScript implementation across the stack
- ✅ **Production Ready** - Deployed on cloud infrastructure with CI/CD
- ✅ **Scalable Design** - Horizontal scaling capabilities
- ✅ **Modern Tech Stack** - Latest versions of React, Node.js, and databases

---

## 🏗️ Architecture

<div align="center">

```mermaid
graph TB
    %% === USER LAYER ===
    subgraph "🎯 User Interface Layer"
        USER[👤 User<br/>Browser/Mobile<br/>Real-time Experience]
    end
    
    %% === CLIENT LAYER ===
    subgraph "🌐 Frontend Layer"
        WEB["🖥️ React Web App<br/>📍 Port: 5173<br/>⚡ Real-time UI<br/>🔄 State Management"]
    end
    
    %% === API LAYER ===
    subgraph "🚀 Backend Services"
        API["🔗 Express API<br/>📍 Port: 4000<br/>🛡️ REST Endpoints<br/>📝 CRUD Operations"]
        SOCKET["🔌 Socket.IO Server<br/>⚡ WebSocket Events<br/>🔔 Live Notifications<br/>📡 Real-time Updates"]
    end
    
    %% === PROCESSING LAYER ===
    subgraph "⚙️ Background Processing"
        QUEUE["📋 Job Queue<br/>🚀 BullMQ<br/>⏰ Event Scheduling<br/>🔄 Task Management"]
        WORKER["🔧 Background Worker<br/>⚡ Event Processing<br/>🏭 Notification Factory<br/>📊 Analytics Engine"]
    end
    
    %% === DATA LAYER ===
    subgraph "🗄️ Data Storage"
        MONGO[("🍃 MongoDB<br/>👥 Users & Profiles<br/>📄 Posts & Content<br/>🔔 Notifications<br/>📊 Activity Logs")]
        REDIS[("🔴 Redis<br/>📋 Job Queues<br/>⚡ Cache Layer<br/>🔒 Session Storage")]
    end
    
    %% === FUTURE SERVICES ===
    subgraph "🔮 Future Integrations"
        EMAIL["📧 Email Service<br/>📨 SMTP/SendGrid<br/>📬 Digest Emails"]
        PUSH["📲 Push Notifications<br/>🔔 Mobile Push<br/>🌐 Web Push"]
        ANALYTICS["📊 Analytics<br/>📈 User Insights<br/>📉 Performance Metrics"]
    end
    
    %% === MAIN FLOW ===
    USER --> WEB
    WEB <-->|🔄 HTTP/HTTPS| API
    WEB <-->|⚡ WebSocket| SOCKET
    
    %% === API OPERATIONS ===
    API -->|📝 Create Jobs| QUEUE
    API <-->|💾 Read/Write| MONGO
    API <-->|⚡ Cache| REDIS
    
    %% === BACKGROUND PROCESSING ===
    QUEUE <-->|📋 Queue Management| REDIS
    QUEUE -->|🔄 Process Jobs| WORKER
    WORKER -->|💾 Store Results| MONGO
    WORKER -->|🔔 Emit Events| SOCKET
    
    %% === REAL-TIME UPDATES ===
    SOCKET -->|⚡ Live Updates| WEB
    
    %% === FUTURE CONNECTIONS ===
    WORKER -.->|📧 Send Emails| EMAIL
    WORKER -.->|📲 Push Alerts| PUSH
    API -.->|📊 Track Events| ANALYTICS
    
    %% === STYLING ===
    classDef userLayer fill:#e3f2fd,stroke:#1565c0,stroke-width:3px,color:#0d47a1
    classDef clientLayer fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px,color:#1b5e20
    classDef apiLayer fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#e65100
    classDef processLayer fill:#fce4ec,stroke:#c2185b,stroke-width:3px,color:#880e4f
    classDef dataLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#4a148c
    classDef futureLayer fill:#fafafa,stroke:#616161,stroke-width:2px,stroke-dasharray:5 5,color:#424242
    
    class USER userLayer
    class WEB clientLayer
    class API,SOCKET apiLayer
    class QUEUE,WORKER processLayer
    class MONGO,REDIS dataLayer
    class EMAIL,PUSH,ANALYTICS futureLayer
```

</div>

### 🎯 Core Components

| Component | Technology | Purpose | Status |
|-----------|------------|---------|--------|
| **🌐 Web App** | React + Vite + TypeScript | User interface & real-time updates | ✅ Active |
| **🚀 API Server** | Node.js + Express + Socket.IO | REST API & WebSocket connections | ✅ Active |
| **⚡ Background Worker** | BullMQ + Redis | Async event processing | ✅ Active |
| **🔗 Shared Types** | TypeScript | Type safety across services | ✅ Active |

## 📋 Link to System Design

📖 **[Complete System Design Document](./docs/system-design.md)**

## 🚀 Quick Start

<div align="center">

**Get up and running in under 5 minutes!**

</div>

### 📋 Prerequisites

<table>
<tr>
<td align="center" width="33%">
<img src="https://nodejs.org/static/images/logo.svg" width="50" height="50"><br/>
<strong>Node.js 18+</strong><br/>
<a href="https://nodejs.org/">Download</a>
</td>
<td align="center" width="33%">
<img src="https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png" width="50" height="50"><br/>
<strong>MongoDB</strong><br/>
<a href="https://www.mongodb.com/try/download/community">Local</a> | <a href="https://www.mongodb.com/atlas">Atlas</a>
</td>
<td align="center" width="33%">
<img src="https://redis.io/images/redis-white.png" width="50" height="50"><br/>
<strong>Redis</strong><br/>
<a href="https://redis.io/download">Local</a> | <a href="https://upstash.com/">Upstash</a>
</td>
</tr>
</table>

```bash
# Install pnpm globally if you haven't already
npm install -g pnpm
```

### 🔧 Installation

```bash
# 1. Clone & Navigate
git clone https://github.com/chiragSahani/InsydNotification.git
cd InsydNotification

# 2. Install Dependencies
pnpm install
```

### ⚙️ Environment Setup

<details>
<summary><strong>📁 Click to expand environment configuration</strong></summary>

Create `.env` files in each app directory:

<table>
<tr>
<th width="33%">🚀 API Server</th>
<th width="33%">⚡ Worker</th>
<th width="33%">🌐 Web App</th>
</tr>
<tr>
<td valign="top">

**apps/api/.env:**
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/insyd-notifications
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:5173
SOCKET_PUBLIC_URL=http://localhost:4000
```

</td>
<td valign="top">

**apps/worker/.env:**
```env
MONGO_URI=mongodb://localhost:27017/insyd-notifications
REDIS_URL=redis://localhost:6379
```

</td>
<td valign="top">

**apps/web/.env:**
```env
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

</td>
</tr>
</table>

</details>

### 🌱 Bootstrap & Launch

```bash
# 3. Seed Demo Data
pnpm seed

# 4. Start All Services
pnpm dev
```

<div align="center">

🎉 **That's it! Your notification system is now running:**

| Service | URL | Status |
|---------|-----|--------|
| 🌐 Web App | http://localhost:5173 | ✅ Frontend |
| 🚀 API Server | http://localhost:4000 | ✅ Backend |
| ⚡ Background Worker | N/A | ✅ Processing |

</div>

## 🎯 Interactive Demo

<div align="center">

**Experience real-time notifications in action!**

<img src="https://via.placeholder.com/800x400/2563eb/ffffff?text=Demo+Screenshot+%F0%9F%92%BB" alt="Demo Screenshot" width="80%">

*Interactive notification dashboard with real-time updates*

</div>

## ✨ Features

### 🔔 Notification System
- **Real-time Push Notifications** - Instant delivery via WebSocket
- **User-specific Feeds** - Personalized notification streams
- **Read/Unread Tracking** - Status management and marking
- **Deduplication Logic** - Prevents duplicate notifications
- **Delivery Guarantees** - Retry mechanisms for failed deliveries

### 👥 Social Features
- **User Management** - Registration, profiles, and authentication
- **Follow System** - User relationships and social graph
- **Activity Feeds** - Timeline of user interactions
- **Post Creation** - Content publishing with notifications

### 📊 Analytics & Monitoring
- **Real-time Dashboard** - System metrics and user statistics
- **Delivery Analytics** - Notification success rates
- **Performance Monitoring** - API response times and throughput
- **Error Tracking** - Comprehensive error logging and reporting

### ⚡ Performance Features
- **Horizontal Scaling** - Independent service scaling
- **Caching Strategy** - Redis-based caching for performance
- **Database Optimization** - Indexed queries and pagination
- **Queue Management** - Background job processing with priorities

## 🛠️ Technology Stack

### **Backend Services**
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime environment | 18+ |
| **Express.js** | Web framework | ^4.18.2 |
| **TypeScript** | Type safety | ^5.3.3 |
| **Socket.IO** | Real-time communication | ^4.7.4 |
| **BullMQ** | Job queue management | ^4.15.4 |
| **Mongoose** | MongoDB ODM | ^8.0.3 |
| **Zod** | Runtime type validation | ^3.22.4 |
| **Winston** | Logging framework | ^3.17.0 |

### **Frontend Application**
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework | ^18.2.0 |
| **TypeScript** | Type safety | ^5.3.3 |
| **Vite** | Build tool | ^5.0.10 |
| **Tailwind CSS** | Styling framework | ^3.4.0 |
| **Framer Motion** | Animation library | ^10.16.5 |
| **Socket.IO Client** | Real-time client | ^4.7.4 |

### **Infrastructure & DevOps**
| Technology | Purpose |
|-----------|---------|
| **MongoDB Atlas** | Managed database |
| **Redis Cloud** | Managed cache/queue |
| **Render** | Cloud deployment |
| **GitHub Actions** | CI/CD pipeline |
| **pnpm** | Package management |

### 🚀 Test Flow

<table>
<tr>
<td width="50%" valign="top">

**🎭 Step 1: Choose Your User**
- Open http://localhost:5173
- Select a demo user from dropdown
- Switch between different users

**⚡ Step 2: Generate Activity**
- 📝 Create posts
- 👥 Follow other users  
- ❤️ Like posts
- 💬 Add comments

</td>
<td width="50%" valign="top">

**🔔 Step 3: Watch Magic Happen**
- Real-time notifications appear instantly
- See notification badges update
- Click to mark as read
- Observe state synchronization

**🌐 Step 4: Multi-User Testing**
- Open multiple browser tabs
- Use different demo users
- Watch cross-user interactions

</td>
</tr>
</table>

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

<div align="center">

```
🏗️ insyd-notifications-poc/
├── 📱 apps/                    # Application services
│   ├── 🌐 web/                # React frontend application
│   │   ├── src/components/    # Reusable UI components
│   │   ├── src/contexts/      # React context providers
│   │   └── src/hooks/         # Custom React hooks
│   ├── 🚀 api/                # Express API server
│   │   ├── src/routes/        # API route handlers
│   │   ├── src/models/        # Database models
│   │   ├── src/utils/         # Utility functions
│   │   └── src/websocket/     # Socket.IO handlers
│   └── ⚡ worker/             # Background job processor
│       ├── src/processors/    # Job processors
│       └── src/queues/        # Queue definitions
├── 📦 packages/               # Shared packages
│   └── 🔗 types/             # TypeScript definitions
├── 📚 docs/                   # Documentation
│   └── system-design.md      # Architecture details
├── 🐳 docker-compose.yml     # Local development setup
├── 📋 package.json           # Workspace configuration
└── 📖 README.md              # This file
```

</div>

### 🎯 Key Directories

| Directory | Purpose | Technologies |
|-----------|---------|--------------|
| `apps/web/src/` | Frontend UI & state management | React, TypeScript, Tailwind CSS |
| `apps/api/src/` | REST API & WebSocket server | Express, Socket.IO, MongoDB |
| `apps/worker/src/` | Background job processing | BullMQ, Redis, MongoDB |
| `packages/types/` | Shared type definitions | TypeScript |

## 🧪 Testing & Commands

### 🧪 Testing Suite

<table>
<tr>
<th width="50%">🌐 All Services</th>
<th width="50%">🎯 Specific Service</th>
</tr>
<tr>
<td>

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage
```

</td>
<td>

```bash
# Individual service tests
pnpm --filter api test
pnpm --filter worker test  
pnpm --filter web test
pnpm --filter types test
```

</td>
</tr>
</table>

### 🛠️ Development Commands

<div align="center">

| Command | Description | Usage |
|---------|-------------|-------|
| 🚀 `pnpm dev` | Start all services in development | Development workflow |
| 🏗️ `pnpm build` | Build all applications | Production preparation |
| ▶️ `pnpm start` | Start production builds | Production deployment |
| 🌱 `pnpm seed` | Seed database with demo data | Initial setup |
| 🧪 `pnpm test` | Run all test suites | Quality assurance |
| 🔍 `pnpm lint` | Lint all code | Code quality |
| 🧹 `pnpm clean` | Clean build artifacts | Fresh start |

</div>

## 🚨 Troubleshooting

<div align="center">

**Stuck? Here are common fixes for typical issues:**

</div>

<details>
<summary><strong>🍃 MongoDB Connection Issues</strong></summary>

**Symptoms:** `MongooseServerSelectionError` or connection timeouts

**Solutions:**
- ✅ Ensure MongoDB is running: `brew services start mongodb-community` (Mac) or `sudo systemctl start mongod` (Linux)
- ✅ Check connection string in `.env` files
- ✅ For Atlas: verify network access and credentials
- ✅ Test connection: `mongosh "mongodb://localhost:27017/insyd-notifications"`

</details>

<details>
<summary><strong>🔴 Redis Connection Issues</strong></summary>

**Symptoms:** `Redis connection failed` or queue errors

**Solutions:**
- ✅ Start Redis locally: `redis-server` or check if running on port 6379
- ✅ For Upstash: verify REDIS_URL includes authentication
- ✅ Test connection: `redis-cli ping` (should return "PONG")
- ✅ Check firewall settings for port 6379

</details>

<details>
<summary><strong>🔌 Socket.IO Not Working</strong></summary>

**Symptoms:** Real-time notifications not updating

**Solutions:**
- ✅ Verify SOCKET_PUBLIC_URL matches your API server URL
- ✅ Check CORS_ORIGIN allows your frontend origin
- ✅ Ensure API server starts before opening frontend
- ✅ Check browser console for WebSocket errors

</details>

<details>
<summary><strong>🔌 Port Conflicts</strong></summary>

**Symptoms:** `EADDRINUSE` or port already in use errors

**Solutions:**
- ✅ Change PORT in respective `.env` files (API: 4000, Web: 5173)
- ✅ Update URLs in other `.env` files accordingly  
- ✅ Kill processes: `lsof -ti:4000 | xargs kill -9` (Mac/Linux)
- ✅ Use different ports: `PORT=4001 pnpm --filter api dev`

</details>

## 🎯 Project Scope

<table>
<tr>
<th width="50%">✅ In Scope (POC Goals)</th>
<th width="50%">❌ Out of Scope (Future)</th>
</tr>
<tr>
<td valign="top">

**Core Features:**
- ✅ Real-time notifications via WebSocket
- ✅ CRUD operations for notifications  
- ✅ User interaction tracking
- ✅ Background job processing
- ✅ Multi-user demo environment
- ✅ Responsive web interface

**Technical:**
- ✅ TypeScript throughout
- ✅ Scalable monorepo architecture
- ✅ Docker-ready setup
- ✅ Test framework foundation

</td>
<td valign="top">

**Authentication & Security:**
- ❌ User authentication & authorization
- ❌ JWT/OAuth implementation  
- ❌ Rate limiting & security measures

**Production Features:**
- ❌ Email/SMS notification delivery
- ❌ Push notifications (WebPush)
- ❌ Advanced analytics & metrics
- ❌ GDPR compliance features
- ❌ Multi-tenancy support

**Infrastructure:**
- ❌ Production monitoring
- ❌ Caching layers (Redis as cache)
- ❌ Multi-region deployment

</td>
</tr>
</table>

## 🔮 Roadmap

<div align="center">

```mermaid
timeline
    title Insyd Notifications Roadmap
    
    section Phase 1 - POC ✅
        Current : Real-time notifications
                : Basic CRUD operations
                : Multi-user demo
                : WebSocket foundation
    
    section Phase 2 - MVP 🚧
        Q1 2024 : Authentication system
                : Email notifications  
                : User preferences
                : Basic analytics
    
    section Phase 3 - Scale 🔮
        Q2 2024 : Push notifications
                : Notification batching
                : Advanced preferences
                : Mobile app support
    
    section Phase 4 - Enterprise 🌟
        Q3 2024 : Multi-region deployment
                : Advanced analytics
                : GDPR compliance
                : Enterprise integrations
```

</div>

---

<div align="center">

## 📚 API Documentation

### Authentication
Currently using simple user selection for demo purposes. JWT authentication can be implemented for production.

### Core Endpoints

#### Users
```http
GET    /api/users              # List all users
POST   /api/users              # Create user
GET    /api/users/:id          # Get user by ID
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
```

#### Notifications
```http
GET    /api/notifications?userId=123    # Get user notifications
POST   /api/notifications/:id/read     # Mark as read
```

#### Posts
```http
GET    /api/posts              # List posts
POST   /api/posts              # Create post
GET    /api/posts/:id          # Get post
DELETE /api/posts/:id          # Delete post
```

### WebSocket Events

**Client → Server:**
```javascript
socket.emit('join', { userId: '123' })
```

**Server → Client:**
```javascript
socket.on('notification:new', (notification) => {
  // Handle new notification
})
```

For complete API documentation, see [API_DOCS.md](./API_DOCS.md).

## 🌐 Deployment

### Production Deployment (Render)

The application is configured for deployment on Render with the following services:

1. **API Service** (Web Service)
2. **Worker Service** (Background Worker)  
3. **Frontend** (Static Site)

### Environment Variables

Set these environment variables in your deployment platform:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_SECRET=...
CORS_ORIGIN=https://your-frontend.onrender.com
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev          # Start all services in dev mode
pnpm dev:api      # Start only API service
pnpm dev:worker   # Start only worker service  
pnpm dev:web      # Start only frontend

# Building
pnpm build        # Build all packages
pnpm build:api    # Build API only
pnpm build:worker # Build worker only
pnpm build:web    # Build frontend only

# Testing
pnpm test         # Run all tests
pnpm lint         # Run linting
pnpm typecheck    # Run TypeScript checking

# Database
pnpm seed         # Seed database with sample data
```

---

## 👨‍💻 Author

**Chirag Sahani**
- **GitHub**: [@chiragSahani](https://github.com/chiragSahani)
- **Email**: chiragsahani093@gmail.com
- **LinkedIn**: [Connect with me](https://linkedin.com/in/chirag-sahani)

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/chiragSahani/InsydNotification)
![GitHub forks](https://img.shields.io/github/forks/chiragSahani/InsydNotification)
![GitHub issues](https://img.shields.io/github/issues/chiragSahani/InsydNotification)
![GitHub license](https://img.shields.io/github/license/chiragSahani/InsydNotification)

---

**⭐ If you find this project helpful, please consider giving it a star!**

*This project demonstrates production-ready full-stack development with modern technologies and best practices.*