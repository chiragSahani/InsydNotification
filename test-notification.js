import { MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb+srv://chirag:Z7nbDxOgqrqt4aFu@insydnotifications.ihshkah.mongodb.net/?retryWrites=true&w=majority&appName=InsydNotifications';

async function createTestNotifications() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('insyd-notifications');
    const notifications = db.collection('notifications');
    
    // Test notifications for Bob Smith (68a9db0f5cb46f0489b87362)
    const testNotifications = [
      {
        userId: '68a9db0f5cb46f0489b87362',
        type: 'NEW_FOLLOWER',
        actorId: '68a9db0f5cb46f0489b87361',
        entityId: '68a9db0f5cb46f0489b87361',
        entityType: 'USER',
        message: 'Alice Johnson started following you!',
        isRead: false,
        dedupeKey: `follow-${Date.now()}-1`,
        deliveryStatus: 'EMITTED',
        createdAt: new Date()
      },
      {
        userId: '68a9db0f5cb46f0489b87362',
        type: 'NEW_POST_FROM_FOLLOWING',
        actorId: '68a9db0f5cb46f0489b87363',
        entityId: 'post123',
        entityType: 'POST',
        message: 'Carol Davis shared a new post: "Working on sustainable architecture principles for our next project."',
        isRead: false,
        dedupeKey: `post-${Date.now()}-2`,
        deliveryStatus: 'EMITTED',
        createdAt: new Date(Date.now() - 300000) // 5 minutes ago
      },
      {
        userId: '68a9db0f5cb46f0489b87362',
        type: 'NEW_LIKE_ON_YOUR_POST',
        actorId: '68a9db0f5cb46f0489b87364',
        entityId: 'post456',
        entityType: 'POST',
        message: 'David Wilson liked your post: "Just completed an amazing modern office building design!"',
        isRead: true,
        dedupeKey: `like-${Date.now()}-3`,
        deliveryStatus: 'EMITTED',
        createdAt: new Date(Date.now() - 600000) // 10 minutes ago
      },
      {
        userId: '68a9db0f5cb46f0489b87362',
        type: 'NEW_COMMENT_ON_YOUR_POST',
        actorId: '68a9db0f5cb46f0489b87365',
        entityId: 'post456',
        entityType: 'POST',
        message: 'Eva Martinez commented on your post: "Great work! Love the clean lines and use of natural light."',
        isRead: false,
        dedupeKey: `comment-${Date.now()}-4`,
        deliveryStatus: 'EMITTED',
        createdAt: new Date(Date.now() - 900000) // 15 minutes ago
      }
    ];
    
    await notifications.insertMany(testNotifications);
    console.log(`Created ${testNotifications.length} test notifications`);
    
    // Create notifications for other users too
    const moreNotifications = [
      {
        userId: '68a9db0f5cb46f0489b87361', // Alice
        type: 'NEW_FOLLOWER',
        actorId: '68a9db0f5cb46f0489b87362',
        entityId: '68a9db0f5cb46f0489b87362',
        entityType: 'USER',
        message: 'Bob Smith started following you!',
        isRead: false,
        dedupeKey: `follow-${Date.now()}-5`,
        deliveryStatus: 'EMITTED',
        createdAt: new Date()
      },
      {
        userId: '68a9db0f5cb46f0489b87363', // Carol
        type: 'NEW_LIKE_ON_YOUR_POST',
        actorId: '68a9db0f5cb46f0489b87361',
        entityId: 'post789',
        entityType: 'POST',
        message: 'Alice Johnson liked your post: "Exploring parametric design tools for complex geometries."',
        isRead: false,
        dedupeKey: `like-${Date.now()}-6`,
        deliveryStatus: 'EMITTED',
        createdAt: new Date(Date.now() - 120000) // 2 minutes ago
      }
    ];
    
    await notifications.insertMany(moreNotifications);
    console.log(`Created ${moreNotifications.length} additional notifications`);
    
    console.log('✅ Test notifications created successfully!');
    
  } catch (error) {
    console.error('Error creating test notifications:', error);
  } finally {
    await client.close();
  }
}

createTestNotifications();