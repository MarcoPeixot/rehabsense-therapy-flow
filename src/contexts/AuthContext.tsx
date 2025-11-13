import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiClient } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  registerId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { name: string; email: string; password: string; registerId: string }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = ApiClient.getToken();
      if (token) {
        const userData = await ApiClient.getMe();
        setUser(userData);
      }
    } catch (error) {
      ApiClient.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await ApiClient.signIn({ email, password });
    ApiClient.setToken(response.access_token);
    const userData = await ApiClient.getMe();
    setUser(userData);
  };

  const signUp = async (data: { name: string; email: string; password: string; registerId: string }) => {
    const response = await ApiClient.signUp(data);
    ApiClient.setToken(response.access_token);
    const userData = await ApiClient.getMe();
    setUser(userData);
  };

  const signOut = () => {
    ApiClient.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
