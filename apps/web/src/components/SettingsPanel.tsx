import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Volume2, 
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Save,
  RefreshCw
} from 'lucide-react';
import type { User } from '@insyd/types';

interface SettingsPanelProps {
  selectedUser: User;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  notificationTypes: {
    followers: boolean;
    posts: boolean;
    likes: boolean;
    comments: boolean;
  };
}

export function SettingsPanel({ }: SettingsPanelProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    darkMode: false,
    notificationTypes: {
      followers: true,
      posts: true,
      likes: true,
      comments: true
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K, 
    value: NotificationSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNotificationType = (
    type: keyof NotificationSettings['notificationTypes'], 
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    label 
  }: { 
    enabled: boolean; 
    onChange: (value: boolean) => void; 
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-slate-700 font-medium">{label}</span>
      <motion.button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-indigo-600' : 'bg-slate-300'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-gradient-to-tr from-slate-500 to-slate-600 rounded-xl"
          >
            <Settings className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
            <p className="text-slate-600">Customize your notification preferences</p>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-lg">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">General Preferences</h3>
        </div>

        <div className="space-y-6">
          <ToggleSwitch
            enabled={settings.emailNotifications}
            onChange={(value) => updateSetting('emailNotifications', value)}
            label="Email Notifications"
          />
          
          <ToggleSwitch
            enabled={settings.pushNotifications}
            onChange={(value) => updateSetting('pushNotifications', value)}
            label="Push Notifications"
          />
          
          <ToggleSwitch
            enabled={settings.soundEnabled}
            onChange={(value) => updateSetting('soundEnabled', value)}
            label="Sound Notifications"
          />
          
          <ToggleSwitch
            enabled={settings.darkMode}
            onChange={(value) => updateSetting('darkMode', value)}
            label="Dark Mode"
          />
        </div>
      </motion.div>

      {/* Notification Types */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-purple-500 to-purple-600 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Notification Types</h3>
        </div>

        <div className="space-y-6">
          <ToggleSwitch
            enabled={settings.notificationTypes.followers}
            onChange={(value) => updateNotificationType('followers', value)}
            label="New Followers"
          />
          
          <ToggleSwitch
            enabled={settings.notificationTypes.posts}
            onChange={(value) => updateNotificationType('posts', value)}
            label="New Posts from Following"
          />
          
          <ToggleSwitch
            enabled={settings.notificationTypes.likes}
            onChange={(value) => updateNotificationType('likes', value)}
            label="Likes on Your Posts"
          />
          
          <ToggleSwitch
            enabled={settings.notificationTypes.comments}
            onChange={(value) => updateNotificationType('comments', value)}
            label="Comments on Your Posts"
          />
        </div>
      </motion.div>

      {/* Delivery Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-green-500 to-green-600 rounded-lg">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Delivery Methods</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              icon: Smartphone, 
              title: 'Mobile Push', 
              description: 'Instant notifications on your device',
              enabled: settings.pushNotifications
            },
            { 
              icon: Mail, 
              title: 'Email Digest', 
              description: 'Daily summary via email',
              enabled: settings.emailNotifications
            },
            { 
              icon: settings.soundEnabled ? Volume2 : VolumeX, 
              title: 'Sound Alerts', 
              description: 'Audio notifications for new messages',
              enabled: settings.soundEnabled
            }
          ].map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  method.enabled 
                    ? 'border-indigo-200 bg-indigo-50' 
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg inline-block mb-3 ${
                  method.enabled 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">{method.title}</h4>
                <p className="text-sm text-slate-600">{method.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex justify-center"
      >
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
            saveSuccess
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Save className="w-4 h-4" />
                </motion.div>
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}