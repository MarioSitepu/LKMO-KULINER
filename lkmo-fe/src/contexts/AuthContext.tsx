import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginGoogle: (tokenId: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await authAPI.login({ email, password, rememberMe });
      
      // Debug: log response structure
      console.log('Login response:', response);
      
      // Check if response has the expected structure
      // Response dari api.ts sudah di-parse, jadi structure: { success: true, data: { token, user } }
      if (!response) {
        throw new Error('Tidak ada response dari server');
      }
      
      // Check if response has data property
      if (!response.data) {
        throw new Error('Format response tidak valid dari server');
      }
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken) {
        throw new Error('Token tidak ditemukan dalam response');
      }
      
      if (!userData) {
        throw new Error('Data user tidak ditemukan dalam response');
      }
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Login error detail:', error);
      console.error('Error response:', error.response);
      
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map((err: any) => err.msg || err.message).join(', ');
        throw new Error(errorMessages || error.response?.data?.message || 'Login gagal');
      }
      
      // Handle network errors
      if (!error.response) {
        if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
          throw new Error('Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda atau coba lagi nanti.');
        }
        throw new Error('Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda atau coba lagi nanti.');
      }
      
      // Handle specific status codes
      if (error.response.status === 401) {
        throw new Error('Email atau password salah');
      }
      
      if (error.response.status === 400) {
        throw new Error(error.response?.data?.message || 'Data yang dimasukkan tidak valid');
      }
      
      if (error.response.status === 500) {
        throw new Error('Server error. Silakan coba lagi nanti');
      }
      
      // Handle other errors
      throw new Error(error.response?.data?.message || error.message || 'Login gagal. Silakan coba lagi.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ name, email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map((err: any) => err.msg || err.message).join(', ');
        throw new Error(errorMessages || error.response?.data?.message || 'Registrasi gagal');
      }
      
      // Handle network errors
      if (!error.response) {
        if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
          throw new Error('Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda atau coba lagi nanti.');
        }
        throw new Error('Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda atau coba lagi nanti.');
      }
      
      // Handle other errors
      throw new Error(error.response?.data?.message || error.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  const loginGoogle = async (tokenId: string) => {
    try {
      const response = await authAPI.loginGoogle(tokenId);
      
      // Debug: log response structure
      console.log('Google login response:', response);
      
      // Check if response has the expected structure
      if (!response) {
        throw new Error('Tidak ada response dari server');
      }
      
      // Check if response has data property
      if (!response.data) {
        throw new Error('Format response tidak valid dari server');
      }
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken) {
        throw new Error('Token tidak ditemukan dalam response');
      }
      
      if (!userData) {
        throw new Error('Data user tidak ditemukan dalam response');
      }
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Google login error detail:', error);
      console.error('Error response:', error.response);
      
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map((err: any) => err.msg || err.message).join(', ');
        throw new Error(errorMessages || error.response?.data?.message || 'Login dengan Google gagal');
      }
      
      // Handle network errors
      if (!error.response) {
        if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
          throw new Error('Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda atau coba lagi nanti.');
        }
        throw new Error('Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda atau coba lagi nanti.');
      }
      
      // Handle specific status codes
      if (error.response.status === 401) {
        throw new Error('Autentikasi Google gagal. Silakan coba lagi.');
      }
      
      if (error.response.status === 400) {
        throw new Error(error.response?.data?.message || 'Data yang dimasukkan tidak valid');
      }
      
      if (error.response.status === 500) {
        throw new Error('Server error. Silakan coba lagi nanti');
      }
      
      // Handle other errors
      throw new Error(error.response?.data?.message || error.message || 'Login dengan Google gagal. Silakan coba lagi.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginGoogle,
        register,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

