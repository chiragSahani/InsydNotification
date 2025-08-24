import { model, Schema } from 'mongoose';

interface INotificationTypes {
  followers: boolean;
  posts: boolean;
  likes: boolean;
  comments: boolean;
}

interface IDeliveryMethods {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface IFrequency {
  realTime: boolean;
  daily: boolean;
  weekly: boolean;
}

interface ISettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  notificationTypes: INotificationTypes;
  deliveryMethods: IDeliveryMethods;
  frequency: IFrequency;
  createdAt: Date;
  updatedAt: Date;
}

const notificationTypesSchema = new Schema<INotificationTypes>({
  followers: { type: Boolean, default: true },
  posts: { type: Boolean, default: true },
  likes: { type: Boolean, default: true },
  comments: { type: Boolean, default: true }
}, { _id: false });

const deliveryMethodsSchema = new Schema<IDeliveryMethods>({
  email: { type: Boolean, default: true },
  push: { type: Boolean, default: true },
  sms: { type: Boolean, default: false }
}, { _id: false });

const frequencySchema = new Schema<IFrequency>({
  realTime: { type: Boolean, default: true },
  daily: { type: Boolean, default: false },
  weekly: { type: Boolean, default: false }
}, { _id: false });

const settingsSchema = new Schema<ISettings>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  soundEnabled: {
    type: Boolean,
    default: true
  },
  darkMode: {
    type: Boolean,
    default: false
  },
  notificationTypes: {
    type: notificationTypesSchema,
    default: () => ({
      followers: true,
      posts: true,
      likes: true,
      comments: true
    })
  },
  deliveryMethods: {
    type: deliveryMethodsSchema,
    default: () => ({
      email: true,
      push: true,
      sms: false
    })
  },
  frequency: {
    type: frequencySchema,
    default: () => ({
      realTime: true,
      daily: false,
      weekly: false
    })
  }
}, {
  timestamps: true,
  collection: 'settings'
});

// Ensure only one settings document per user
settingsSchema.index({ userId: 1 }, { unique: true });

export const Settings = model<ISettings>('Settings', settingsSchema);
export type { ISettings, INotificationTypes, IDeliveryMethods, IFrequency };