import { useState, useEffect } from 'react';
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
  RefreshCw,
  Moon,
  Sun,
  RotateCcw,
  Shield,
  Clock,
  Zap
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSocket } from '../hooks/useSocket';
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
  deliveryMethods: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  frequency: {
    realTime: boolean;
    daily: boolean;
    weekly: boolean;
  };
}

export function SettingsPanel({ selectedUser }: SettingsPanelProps) {
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
    },
    deliveryMethods: {
      email: true,
      push: true,
      sms: false
    },
    frequency: {
      realTime: true,
      daily: false,
      weekly: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, toggleTheme, setTheme } = useTheme();
  const socket = useSocket(selectedUser);

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

  const updateDeliveryMethod = (
    method: keyof NotificationSettings['deliveryMethods'], 
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      deliveryMethods: {
        ...prev.deliveryMethods,
        [method]: value
      }
    }));
  };

  const updateFrequency = (
    freq: keyof NotificationSettings['frequency'], 
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [freq]: value
      }
    }));
  };

  // Load settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/${selectedUser._id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const apiSettings = result.data;
          setSettings({
            emailNotifications: apiSettings.emailNotifications,
            pushNotifications: apiSettings.pushNotifications,
            soundEnabled: apiSettings.soundEnabled,
            darkMode: apiSettings.darkMode,
            notificationTypes: apiSettings.notificationTypes,
            deliveryMethods: apiSettings.deliveryMethods,
            frequency: apiSettings.frequency
          });
          
          // Sync dark mode with theme
          if (apiSettings.darkMode !== (theme === 'dark')) {
            setTheme(apiSettings.darkMode ? 'dark' : 'light');
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedUser) {
      fetchSettings();
    }
  }, [selectedUser, setTheme, theme]);

  // Sync theme changes with settings
  useEffect(() => {
    const isDark = theme === 'dark';
    if (settings.darkMode !== isDark) {
      setSettings(prev => ({
        ...prev,
        darkMode: isDark
      }));
    }
  }, [theme, settings.darkMode]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSaveSuccess(true);
        
        // Emit real-time update
        if (socket) {
          socket.emit('settings:updated', { 
            userId: selectedUser._id, 
            settings: result.data 
          });
        }
        
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error(result.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/${selectedUser._id}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const defaultSettings = result.data;
        setSettings({
          emailNotifications: defaultSettings.emailNotifications,
          pushNotifications: defaultSettings.pushNotifications,
          soundEnabled: defaultSettings.soundEnabled,
          darkMode: defaultSettings.darkMode,
          notificationTypes: defaultSettings.notificationTypes,
          deliveryMethods: defaultSettings.deliveryMethods,
          frequency: defaultSettings.frequency
        });
        
        // Reset theme
        setTheme(defaultSettings.darkMode ? 'dark' : 'light');
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to reset settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDarkModeToggle = (value: boolean) => {
    updateSetting('darkMode', value);
    setTheme(value ? 'dark' : 'light');
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    label,
    disabled = false
  }: { 
    enabled: boolean; 
    onChange: (value: boolean) => void; 
    label: string;
    disabled?: boolean;
  }) => (
    <div className="flex items-center justify-between">
      <span className={`font-medium ${disabled ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </span>
      <motion.button
        onClick={() => !disabled && onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          disabled 
            ? 'bg-slate-200 cursor-not-allowed' 
            : enabled 
              ? 'bg-indigo-600 dark:bg-indigo-500' 
              : 'bg-slate-300 dark:bg-slate-600'
        }`}
        whileTap={disabled ? {} : { scale: 0.95 }}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 p-6"
      >
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-slate-500 dark:text-slate-400">Loading settings...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-tr from-slate-500 to-slate-600 rounded-xl"
            >
              <Settings className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h2>
              <p className="text-slate-600 dark:text-slate-400">Customize your notification preferences</p>
            </div>
          </div>
          
          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-lg">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">General Preferences</h3>
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
            enabled={theme === 'dark'}
            onChange={handleDarkModeToggle}
            label="Dark Mode"
          />
        </div>
      </motion.div>

      {/* Notification Types */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-purple-500 to-purple-600 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Notification Types</h3>
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

      {/* Delivery Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-green-500 to-green-600 rounded-lg">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Delivery Methods</h3>
        </div>

        <div className="space-y-6">
          <ToggleSwitch
            enabled={settings.deliveryMethods.email}
            onChange={(value) => updateDeliveryMethod('email', value)}
            label="Email Delivery"
          />
          
          <ToggleSwitch
            enabled={settings.deliveryMethods.push}
            onChange={(value) => updateDeliveryMethod('push', value)}
            label="Push Notifications"
          />
          
          <ToggleSwitch
            enabled={settings.deliveryMethods.sms}
            onChange={(value) => updateDeliveryMethod('sms', value)}
            label="SMS Notifications"
          />
        </div>
      </motion.div>

      {/* Notification Frequency */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-orange-500 to-red-600 rounded-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Notification Frequency</h3>
        </div>

        <div className="space-y-6">
          <ToggleSwitch
            enabled={settings.frequency.realTime}
            onChange={(value) => updateFrequency('realTime', value)}
            label="Real-time Notifications"
          />
          
          <ToggleSwitch
            enabled={settings.frequency.daily}
            onChange={(value) => updateFrequency('daily', value)}
            label="Daily Digest"
          />
          
          <ToggleSwitch
            enabled={settings.frequency.weekly}
            onChange={(value) => updateFrequency('weekly', value)}
            label="Weekly Summary"
          />
        </div>
      </motion.div>

      {/* Delivery Preview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Delivery Status</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              icon: Mail, 
              title: 'Email Delivery', 
              description: 'Notifications via email',
              enabled: settings.deliveryMethods.email,
              count: settings.emailNotifications ? '24/day' : 'Disabled'
            },
            { 
              icon: Smartphone, 
              title: 'Push Notifications', 
              description: 'Real-time mobile alerts',
              enabled: settings.deliveryMethods.push,
              count: settings.pushNotifications ? 'Real-time' : 'Disabled'
            },
            { 
              icon: MessageSquare, 
              title: 'SMS Alerts', 
              description: 'Text message notifications',
              enabled: settings.deliveryMethods.sms,
              count: settings.deliveryMethods.sms ? '12/day' : 'Disabled'
            }
          ].map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  method.enabled 
                    ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20' 
                    : 'border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/20'
                }`}
              >
                <div className={`p-2 rounded-lg inline-block mb-3 ${
                  method.enabled 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300' 
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-600 dark:text-slate-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{method.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{method.description}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-500">{method.count}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex justify-center gap-4"
      >
        <motion.button
          onClick={handleReset}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </div>
        </motion.button>
        
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