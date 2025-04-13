
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'student' | 'parent' | 'staff';
  class?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Mock users for demonstration
const MOCK_USERS = [
  { id: '1', name: 'Joao', role: 'student' as const, class: '5º Ano A' },
  { id: '2', name: 'Maria Oliveira', role: 'student' as const, class: '4º Ano B' },
  { id: '3', name: 'Roberto Pai', role: 'parent' as const },
  { id: '4', name: 'Func', role: 'staff' as const },
  { id: '5', name: 'Admin Cantina', role: 'admin' as const },
];

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('cantinaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<Object> => {
    // This is a mock login function
    setIsLoading(true);
    
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Simple authentication logic for demo purposes
        // In a real app, we would validate against a server
        const foundUser = MOCK_USERS.find(
          (u) => u.name.toLowerCase() === username.toLowerCase()
        );

        if (foundUser && password === '123') { // Simple password for demo
          setUser(foundUser);
          foundUser.success = true
          localStorage.setItem('cantinaUser', JSON.stringify(foundUser));
          setIsLoading(false);
          resolve(foundUser);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cantinaUser');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
