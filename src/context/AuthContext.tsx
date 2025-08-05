import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Extend AxiosRequestConfig to include _retry property
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const API_BASE_URL = "https://powerhousekrd.pythonanywhere.com";

// Create an Axios instance that will be reused
const createAxiosAuth = (token: string | null) =>
  axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUnauthenticated = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const refreshToken = async (): Promise<string> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, {
        refresh: refreshToken
      });
      
      const newAccessToken = response.data.access;
      localStorage.setItem('authToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      handleUnauthenticated();
      throw error;
    }
  };

  const checkAuth = async () => {
    setIsLoading(true);
    let token = localStorage.getItem('authToken');

    // If no token exists, immediately unauthenticate
    if (!token) {
      handleUnauthenticated();
      setIsLoading(false);
      return;
    }

    try {
      // First attempt with current token
      let axiosAuth = createAxiosAuth(token);
      const response = await axiosAuth.get(`/api/authenticated`);
      
      setIsAuthenticated(true);
      setUserEmail(response.data.email);
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // If 401 error, try refreshing token
      if (axiosError.response?.status === 401) {
        try {
          token = await refreshToken();
          const axiosAuth = createAxiosAuth(token);
          const response = await axiosAuth.get(`/api/authenticated`);
          
          setIsAuthenticated(true);
          setUserEmail(response.data.email);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          handleUnauthenticated();
        }
      } else {
        console.error('Authentication check failed:', error);
        handleUnauthenticated();
      }
    } finally {
      setIsLoading(false);
    }
  };

const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    await axios.post(`${API_BASE_URL}/auth/logout/`, {
      refresh: refreshToken  // Send refresh token in body
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    handleUnauthenticated();
  }
};
  useEffect(() => {
    // Add response interceptor for automatic token refresh
    const interceptor = axios.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Check if it's a 401 error and not a retry
        if (error.response?.status === 401 && !originalRequest?._retry) {
          originalRequest!._retry = true;
          
          try {
            const newToken = await refreshToken();
            originalRequest!.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest!);
          } catch (refreshError) {
            console.error('Token refresh failed in interceptor:', refreshError);
            handleUnauthenticated();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Initial authentication check
    checkAuth();

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      userEmail,
      checkAuth, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};