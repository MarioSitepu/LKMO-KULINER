import axios from 'axios';

// Get base URL from environment variable
let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Normalize URL: remove trailing slash
baseUrl = baseUrl.replace(/\/$/, '');

// Auto-add /api if not present (for backward compatibility)
// This handles cases where VITE_API_URL is set without /api
if (!baseUrl.endsWith('/api')) {
  baseUrl = `${baseUrl}/api`;
}

const API_URL = baseUrl;

// Log API URL for debugging
console.log('🔗 API URL:', API_URL);
console.log('🌐 Environment:', import.meta.env.MODE);
console.log('📝 VITE_API_URL from env:', import.meta.env.VITE_API_URL || '⚠️ NOT SET - using default localhost:5000');
console.log('✅ Normalized API URL:', API_URL);

// Warn if using default localhost in production
if (!import.meta.env.VITE_API_URL && import.meta.env.MODE === 'production') {
  console.error('❌ ERROR: VITE_API_URL tidak di-set di Vercel!');
  console.error('📋 Solusi: Set VITE_API_URL di Vercel Dashboard → Settings → Environment Variables');
  console.error('📋 Format: https://your-backend-name.onrender.com (atau tambahkan /api di akhir)');
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message === 'timeout of 30000ms exceeded') {
      const timeoutError = new Error('Request timeout. Server mungkin sedang sibuk atau sedang sleep (free tier). Silakan coba lagi.');
      timeoutError.name = 'TimeoutError';
      return Promise.reject(timeoutError);
    }

    // Handle network errors
    if (!error.response) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        const networkError = new Error('Tidak dapat terhubung ke server. Pastikan backend sudah running atau coba lagi nanti.');
        networkError.name = 'NetworkError';
        return Promise.reject(networkError);
      }
    }

    // Handle 404 errors
    if (error.response?.status === 404) {
      const notFoundError = new Error('Endpoint tidak ditemukan (404). Pastikan VITE_API_URL sudah benar di environment variables.');
      notFoundError.name = 'NotFoundError';
      return Promise.reject(notFoundError);
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  loginGoogle: async (tokenId: string) => {
    const response = await api.post('/auth/google', { tokenId });
    return response.data;
  },
};

// Recipe API
export const recipeAPI = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    equipment?: string;
    priceRange?: string;
    page?: number;
    limit?: number;
    author?: string;
    sort?: string;
  }) => {
    const response = await api.get('/recipes', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },
  
  create: async (formData: FormData) => {
    const response = await api.post('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  update: async (id: string, formData: FormData) => {
    const response = await api.put(`/recipes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },
  
  save: async (id: string) => {
    const response = await api.post(`/recipes/${id}/save`);
    return response.data;
  },
  
  addReview: async (id: string, data: { rating: number; comment: string }) => {
    const response = await api.post(`/recipes/${id}/reviews`, data);
    return response.data;
  },
  
  getLatest: async (limit: number = 4) => {
    const response = await api.get('/recipes', {
      params: {
        limit,
        sort: 'createdAt'
      }
    });
    return response.data;
  },
  
  getPopularCategories: async () => {
    const response = await api.get('/recipes/stats/popular-categories');
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (formData: FormData) => {
    const response = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  getUserRecipes: async (id: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get(`/users/${id}/recipes`, { params });
    return response.data;
  },
  
  follow: async (id: string) => {
    const response = await api.post(`/users/${id}/follow`);
    return response.data;
  },
  
  getLeaderboard: async () => {
    const response = await api.get('/users/leaderboard');
    return response.data;
  },
};

export default api;

