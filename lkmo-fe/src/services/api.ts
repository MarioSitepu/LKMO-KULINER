import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
};

// Recipe API
export const recipeAPI = {
  getAll: async (params?: {
    category?: string;
    search?: string;
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
};

export default api;

