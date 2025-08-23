import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Send, 
  CheckCircle, 
  XCircle, 
  Users, 
  FileText,
  UserPlus,
  Bell,
  Activity,
  Loader,
  Copy,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import type { User } from '@insyd/types';

interface ApiTestingPanelProps {
  selectedUser: User;
  users: User[];
}

interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  samplePayload?: any;
}

export function ApiTestingPanel({ selectedUser, users }: ApiTestingPanelProps) {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('');
  const [customPayload, setCustomPayload] = useState<string>('');
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [showResponse, setShowResponse] = useState<Record<string, boolean>>({});

  const endpoints: ApiEndpoint[] = [
    // User endpoints
    {
      id: 'get-users',
      name: 'Get All Users',
      method: 'GET',
      path: '/api/users',
      description: 'Fetch all users with pagination',
      category: 'Users',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'get-user',
      name: 'Get User by ID',
      method: 'GET',
      path: `/api/users/${selectedUser._id}`,
      description: 'Get specific user details',
      category: 'Users',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'get-user-stats',
      name: 'Get User Stats',
      method: 'GET',
      path: `/api/users/${selectedUser._id}/stats`,
      description: 'Get user statistics and metrics',
      category: 'Users',
      icon: Activity,
      color: 'from-blue-500 to-blue-600'
    },

    // Notification endpoints
    {
      id: 'get-notifications',
      name: 'Get Notifications',
      method: 'GET',
      path: `/api/notifications?userId=${selectedUser._id}&limit=10`,
      description: 'Fetch user notifications with pagination',
      category: 'Notifications',
      icon: Bell,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'mark-notification-read',
      name: 'Mark Notification as Read',
      method: 'PATCH',
      path: '/api/notifications/{id}/read',
      description: 'Mark a specific notification as read',
      category: 'Notifications',
      icon: CheckCircle,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'get-unread-count',
      name: 'Get Unread Count',
      method: 'GET',
      path: `/api/notifications/${selectedUser._id}/unread-count`,
      description: 'Get count of unread notifications',
      category: 'Notifications',
      icon: Bell,
      color: 'from-indigo-500 to-purple-600'
    },

    // Post endpoints
    {
      id: 'get-posts',
      name: 'Get All Posts',
      method: 'GET',
      path: '/api/posts?limit=10',
      description: 'Fetch all posts with pagination',
      category: 'Posts',
      icon: FileText,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'create-post',
      name: 'Create Post',
      method: 'POST',
      path: '/api/posts',
      description: 'Create a new post',
      category: 'Posts',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      samplePayload: {
        authorId: selectedUser._id,
        content: "This is a test post created via API testing panel!"
      }
    },

    // Follow endpoints
    {
      id: 'create-follow',
      name: 'Follow User',
      method: 'POST',
      path: '/api/follow',
      description: 'Create a follow relationship',
      category: 'Follows',
      icon: UserPlus,
      color: 'from-purple-500 to-purple-600',
      samplePayload: {
        actorId: selectedUser._id,
        targetId: users.find(u => u._id !== selectedUser._id)?._id || ''
      }
    },
    {
      id: 'get-followers',
      name: 'Get Followers',
      method: 'GET',
      path: `/api/follow/${selectedUser._id}/followers`,
      description: 'Get users following this user',
      category: 'Follows',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'get-following',
      name: 'Get Following',
      method: 'GET',
      path: `/api/follow/${selectedUser._id}/following`,
      description: 'Get users this user is following',
      category: 'Follows',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },

    // Event endpoints
    {
      id: 'create-event',
      name: 'Create Event',
      method: 'POST',
      path: '/api/events',
      description: 'Create a domain event for processing',
      category: 'Events',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      samplePayload: {
        type: 'LIKED',
        actorId: selectedUser._id,
        entityId: 'sample-post-id',
        metadata: { test: true }
      }
    }
  ];

  const categories = [...new Set(endpoints.map(e => e.category))];

  const executeEndpoint = async (endpoint: ApiEndpoint) => {
    setLoading(prev => ({ ...prev, [endpoint.id]: true }));
    
    try {
      let url = `${import.meta.env.VITE_API_URL}${endpoint.path}`;
      
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (endpoint.method !== 'GET' && endpoint.samplePayload) {
        const payload = customPayload && activeEndpoint === endpoint.id 
          ? JSON.parse(customPayload) 
          : endpoint.samplePayload;
        options.body = JSON.stringify(payload);
      }

      const response = await fetch(url, options);
      const data = await response.json();
      
      setResults(prev => ({ 
        ...prev, 
        [endpoint.id]: {
          status: response.status,
          statusText: response.statusText,
          data,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [endpoint.id]: {
          status: 0,
          statusText: 'Error',
          data: { error: (error as Error).message },
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint.id]: false }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleResponseVisibility = (endpointId: string) => {
    setShowResponse(prev => ({ ...prev, [endpointId]: !prev[endpointId] }));
  };

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
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl"
          >
            <Code className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">API Testing</h2>
            <p className="text-slate-600">Test all available API endpoints</p>
          </div>
        </div>

        {/* Payload Editor */}
        {activeEndpoint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Custom Payload (JSON)
            </label>
            <textarea
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              className="w-full h-32 p-3 border border-slate-300 rounded-lg font-mono text-sm"
              placeholder="Enter custom JSON payload..."
            />
          </motion.div>
        )}
      </div>

      {/* API Endpoints by Category */}
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4">{category}</h3>
          
          <div className="space-y-3">
            {endpoints.filter(e => e.category === category).map((endpoint, index) => {
              const Icon = endpoint.icon;
              const result = results[endpoint.id];
              const isLoading = loading[endpoint.id];
              const isActive = activeEndpoint === endpoint.id;
              const showResp = showResponse[endpoint.id];
              
              return (
                <motion.div
                  key={endpoint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className={`border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 ${
                    isActive ? 'border-indigo-300 bg-indigo-50/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 bg-gradient-to-tr ${endpoint.color} rounded-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'PATCH' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {endpoint.method}
                          </span>
                          <h4 className="font-semibold text-slate-800">{endpoint.name}</h4>
                        </div>
                        <p className="text-slate-600 text-sm">{endpoint.description}</p>
                        <code className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
                          {endpoint.path}
                        </code>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {endpoint.samplePayload && (
                        <button
                          onClick={() => setActiveEndpoint(isActive ? '' : endpoint.id)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit payload"
                        >
                          <Code className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => copyToClipboard(endpoint.path)}
                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Copy endpoint"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <motion.button
                        onClick={() => executeEndpoint(endpoint)}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                          isLoading 
                            ? 'bg-slate-400 cursor-not-allowed' 
                            : `bg-gradient-to-r ${endpoint.color} hover:shadow-lg`
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            Testing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Test
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Results */}
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 border-t border-slate-200 pt-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.status >= 200 && result.status < 300 ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`font-medium ${
                            result.status >= 200 && result.status < 300 
                              ? 'text-green-700' 
                              : 'text-red-700'
                          }`}>
                            {result.status} {result.statusText}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => toggleResponseVisibility(endpoint.id)}
                          className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          {showResp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {showResp && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-slate-900 rounded-lg p-3 overflow-x-auto"
                        >
                          <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              endpoints.forEach(endpoint => {
                if (endpoint.method === 'GET') {
                  executeEndpoint(endpoint);
                }
              });
            }}
            className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Test All GET Endpoints
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setResults({});
              setLoading({});
              setShowResponse({});
            }}
            className="p-4 rounded-xl bg-gradient-to-r from-slate-500 to-slate-600 text-white font-medium hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Clear All Results
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}