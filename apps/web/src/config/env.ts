// Environment configuration for the web application
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },
  socket: {
    url: import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000',
    reconnectionAttempts: parseInt(import.meta.env.VITE_SOCKET_RECONNECTION_ATTEMPTS || '5'),
    reconnectionDelay: parseInt(import.meta.env.VITE_SOCKET_RECONNECTION_DELAY || '1000'),
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Insyd Notifications',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Real-time notification system',
    environment: import.meta.env.VITE_NODE_ENV || 'development',
  },
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  }
} as const;

export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';