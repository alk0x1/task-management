import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { AuthResponse, LoginData, RegisterData, User } from '../types/index';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    const response = await authService.login(data);
    handleAuthResponse(response);
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    handleAuthResponse(response);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const handleAuthResponse = (response: AuthResponse) => {
    authService.saveAuth(response);
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
      }}
    >
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