# 🔔 InsydNotification - Real-time Notification System

## 🚀 Live Demo

**🌐 Frontend:** https://insyd-notifications-web.onrender.com  
**🔗 API:** https://insyd-notifications-api.onrender.com  
**⚙️ Worker:** Background service processing notifications  

## 📋 Project Overview

A **production-ready, scalable notification system** built with modern technologies. This project demonstrates:

- ✅ **Microservices Architecture** (API + Worker + Frontend)
- ✅ **Real-time Updates** via WebSocket connections
- ✅ **Queue-based Processing** with Redis
- ✅ **TypeScript Monorepo** with shared types
- ✅ **Event-driven Architecture** with outbox pattern
- ✅ **Production Deployment** on Render cloud platform

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Web     │◄──►│    Node.js API   │◄──►│ Background      │
│   Frontend      │    │   (Express.js)   │    │ Worker (BullMQ) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                       │
        │                       ▼                       ▼
        │               ┌──────────────┐        ┌──────────────┐
        └──────────────►│   MongoDB    │        │    Redis     │
                        │  (Database)  │        │   (Queue)    │
                        └──────────────┘        └──────────────┘
```

## 🛠️ Technology Stack

### **Backend**
- **Node.js** + **Express.js** - REST API server
- **TypeScript** - Type safety and developer experience  
- **MongoDB** + **Mongoose** - Document database
- **Redis** + **BullMQ** - Job queue and caching
- **Socket.IO** - Real-time WebSocket communication
- **Zod** - Runtime type validation

### **Frontend** 
- **React** + **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Socket.IO Client** - Real-time updates

### **Infrastructure**
- **pnpm** - Package manager and monorepo
- **Render** - Cloud deployment platform
- **MongoDB Atlas** - Managed database
- **GitHub Actions** - CI/CD (planned)

## ✨ Features

### **🔔 Notification System**
- Real-time push notifications
- User-specific notification feeds
- Read/unread status tracking
- Notification deduplication

### **👥 User Management** 
- User creation and management
- Follow/unfollow relationships
- Activity tracking

### **📊 Analytics Dashboard**
- Notification delivery statistics
- User engagement metrics
- Real-time system monitoring

### **⚡ Event Processing**
- Async event processing with queues
- Reliable message delivery
- Retry mechanisms and error handling
- Event sourcing patterns

## 🔄 Event Flow

1. **Event Creation** → User posts content
2. **Event Storage** → Stored in outbox table  
3. **Queue Processing** → Worker picks up events
4. **Fan-out Logic** → Generate notifications for followers
5. **Real-time Delivery** → Push via WebSocket to online users
6. **Persistence** → Store in database for offline users

## 📈 Scalability Features

- **Horizontal Scaling**: API and Worker can scale independently
- **Queue-based Processing**: Handles traffic spikes gracefully  
- **Database Optimization**: Indexed queries and pagination
- **Caching Strategy**: Redis for frequently accessed data
- **Event-driven Design**: Loose coupling between services

## 🧪 Testing & Quality

- **TypeScript**: 100% type coverage
- **ESLint**: Code quality enforcement
- **Input Validation**: Zod schemas for all endpoints
- **Error Handling**: Comprehensive error boundaries
- **Logging**: Winston for structured logging

## 🚀 Deployment

**Production Environment:** All services deployed on Render
- **Auto-deployments** from GitHub main branch
- **Environment isolation** with proper secrets management
- **Health checks** and monitoring
- **Zero-downtime deployments**

---

## 👨‍💻 Developer Information

**Built by:** Chirag Sahani  
**GitHub:** https://github.com/chiragSahani/InsydNotification  
**Contact:** chiragsahani093@gmail.com  

---

*This project showcases full-stack development skills, microservices architecture, and production deployment experience.*