import { motion } from 'framer-motion';
import { 
  Bell, 
  BarChart3, 
  Settings, 
  Zap,
  Code,
  Users
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-indigo-500 to-purple-600' },
    { id: 'actions', label: 'Actions', icon: Zap, color: 'from-green-500 to-emerald-600' },
    { id: 'users', label: 'Users', icon: Users, color: 'from-cyan-500 to-teal-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'from-slate-500 to-slate-600' }
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-2"
    >
      <nav className="flex gap-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative flex items-center gap-2">
                <motion.div
                  animate={isActive ? { 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1] 
                  } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">{tab.label}</span>
                
                {tab.id === 'notifications' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-red-500 rounded-full ml-1"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-full h-full bg-red-500 rounded-full opacity-75"
                    />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
}