
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  email: string;
  id: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data since Users_logIn table doesn't exist in current Supabase schema
const MOCK_USERS = [
  { id: 1, email: 'admin@drugdealer.com', pwd: 'admin123' },
  { id: 2, email: 'user@drugdealer.com', pwd: 'user123' },
  { id: 3, email: 'demo@drugdealer.com', pwd: 'demo123' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('drugdealer_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', email);
      
      // Mock authentication using predefined users
      const foundUser = MOCK_USERS.find(u => u.email === email && u.pwd === password);
      
      if (!foundUser) {
        console.log('Login failed: Invalid credentials');
        return false;
      }

      const userData = { email: foundUser.email, id: foundUser.id };
      setUser(userData);
      localStorage.setItem('drugdealer_user', JSON.stringify(userData));
      console.log('Login successful:', userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('drugdealer_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
