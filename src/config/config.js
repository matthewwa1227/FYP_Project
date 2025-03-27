// FYP_Project/src/config/config.js

const config = {
    // API configuration
    API_BASE_URL: 'http://192.168.153.131:3000',
    
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  
  // User endpoints
  USERS: {
    GET_ALL: '/api/users',
    GET_BY_ID: '/api/users/:id',
    UPDATE: '/api/users/:id',
  },
    
    // Kid profiles endpoints
    KID_PROFILES: {
      GET_ALL: '/api/kid-profiles',
      GET_BY_PARENT: '/api/kid-profiles/parent/:id',
      CREATE: '/api/kid-profiles',
    },
    
    // Game sessions endpoints
    GAME_SESSIONS: {
      GET_BY_KID: '/api/game-sessions/kid/:id',
      CREATE: '/api/game-sessions',
    },
    
    // Leaderboard endpoint
    LEADERBOARD: {
      GLOBAL: '/api/leaderboard',
    },
    
    // Activity logs endpoint
    ACTIVITY_LOGS: {
      CREATE: '/api/activity-logs',
      GET_USER_LOGS: '/api/activity-logs',
    },
    
    // Request timeout (in milliseconds)
    TIMEOUT: 10000,
  };
  
  export default config;