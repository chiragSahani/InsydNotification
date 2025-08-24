# 📚 API Documentation

## 🔗 Base URL
```
Production: https://insyd-notifications-api.onrender.com
```

## 📋 Available Endpoints

### **👥 Users**
```http
GET    /api/users           # Get all users with pagination
POST   /api/users           # Create new user  
GET    /api/users/:id       # Get specific user
PUT    /api/users/:id       # Update user
DELETE /api/users/:id       # Delete user
```

### **🔔 Notifications**
```http
GET    /api/notifications?userId=123        # Get user notifications
POST   /api/notifications/:id/read          # Mark notification as read
```

### **👥 Follow System**
```http
POST   /api/follow          # Follow a user
DELETE /api/follow          # Unfollow a user
GET    /api/follow/:userId  # Get user's followers/following
```

### **📝 Posts**
```http
GET    /api/posts           # Get all posts
POST   /api/posts           # Create new post
GET    /api/posts/:id       # Get specific post  
DELETE /api/posts/:id       # Delete post
```

### **📊 Events**
```http
POST   /api/events          # Create domain event (triggers notifications)
```

### **⚙️ Settings**
```http
GET    /api/settings/:userId    # Get user notification settings
PUT    /api/settings/:userId    # Update notification preferences
```

## 📡 WebSocket Events

**Connection:** `wss://insyd-notifications-api.onrender.com`

### **Client → Server**
```javascript
socket.emit('join', { userId: '123' })  // Join user's notification room
```

### **Server → Client** 
```javascript
socket.on('notification:new', (data) => {
  // Real-time notification received
  console.log(data.notification)
})
```

## 🧪 Example Usage

### **Create User**
```bash
curl -X POST https://insyd-notifications-api.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

### **Create Post (Triggers Notifications)**
```bash
curl -X POST https://insyd-notifications-api.onrender.com/api/posts \
  -H "Content-Type: application/json" \
  -d '{"authorId": "user123", "content": "Hello World!"}'
```

### **Get Notifications**
```bash
curl "https://insyd-notifications-api.onrender.com/api/notifications?userId=123&limit=10"
```

## 🔄 Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## ⚡ Real-time Demo

1. Open frontend: https://insyd-notifications-web.onrender.com
2. Select a user from the dropdown
3. Create posts or follow users
4. Watch real-time notifications appear instantly!