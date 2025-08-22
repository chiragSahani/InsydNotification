import mongoose from 'mongoose';
import { UserModel } from '../models/User.js';
import { FollowModel } from '../models/Follow.js';
import { PostModel } from '../models/Post.js';
import { config } from '../config/env.js';

const DEMO_USERS = [
  { name: 'Alice Johnson' },
  { name: 'Bob Smith' }, 
  { name: 'Carol Davis' },
  { name: 'David Wilson' },
  { name: 'Eva Martinez' }
];

const DEMO_POSTS = [
  'Just completed an amazing modern office building design!',
  'Working on sustainable architecture principles for our next project.',
  'Love the clean lines in contemporary residential design.',
  'Exploring parametric design tools for complex geometries.',
  'Site visit today - the foundation looks perfect!',
  'Collaboration with engineers is key to successful projects.',
  'Sketching out initial concepts for a community center.',
  'Material selection is crucial for both aesthetics and durability.',
  'Excited about the new green building certifications!',
  'Client presentation went well - moving to development phase.'
];

async function seedDatabase() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB for seeding');
    
    // Clear existing data
    await Promise.all([
      UserModel.deleteMany({}),
      FollowModel.deleteMany({}),
      PostModel.deleteMany({})
    ]);
    
    console.log('Cleared existing data');
    
    // Create demo users
    const users = await UserModel.create(DEMO_USERS);
    console.log(`Created ${users.length} demo users`);
    
    // Create follow relationships (each user follows 2-3 others)
    const followRelationships = [];
    for (let i = 0; i < users.length; i++) {
      const follower = users[i];
      // Follow next 2-3 users (circular)
      const followCount = 2 + Math.floor(Math.random() * 2); // 2 or 3
      for (let j = 1; j <= followCount; j++) {
        const followeeIndex = (i + j) % users.length;
        followRelationships.push({
          followerId: follower._id.toString(),
          followeeId: users[followeeIndex]._id.toString()
        });
      }
    }
    
    await FollowModel.create(followRelationships);
    console.log(`Created ${followRelationships.length} follow relationships`);
    
    // Create demo posts
    const posts = [];
    for (let i = 0; i < DEMO_POSTS.length; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      posts.push({
        authorId: randomUser._id.toString(),
        content: DEMO_POSTS[i]
      });
    }
    
    await PostModel.create(posts);
    console.log(`Created ${posts.length} demo posts`);
    
    console.log('\n✅ Seeding completed successfully!');
    console.log('\nDemo users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (ID: ${user._id})`);
    });
    
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();