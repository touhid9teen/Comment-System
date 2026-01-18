// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    GOOGLE: `${API_BASE_URL}/api/auth/google`,
    PROFILE: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  // Comments
  COMMENTS: {
    BASE: `${API_BASE_URL}/api/comments`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/comments/${id}`,
    REACT: (id: string) => `${API_BASE_URL}/api/comments/${id}/react`,
    REPLIES: (id: string) => `${API_BASE_URL}/api/comments/${id}/replies`,
  },
};
