
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { TipoUsuario } from '../model/User/Enuns/TipoUsuario';

interface User {
  id: string;
  name: string;
  email?: string;
  role: TipoUsuario | string;
  class?: string;
  balance?: number;
  profileImage?: string;
  dietaryPreferences?: string[];
  active?: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addBalance: (amount: number) => void;
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
  { 
    id: '1', 
    name: 'Joao', 
    email: 'joao@escola.edu', 
    role: TipoUsuario.STUDENT, 
    class: '5º Ano A', 
    balance: 25.50,
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    dietaryPreferences: ['Sem glúten'],
    active: true
  },
  { 
    id: '2', 
    name: 'Maria Oliveira', 
    email: 'maria@escola.edu', 
    role: TipoUsuario.STUDENT, 
    class: '4º Ano B', 
    balance: 15.75,
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=1498&q=80',
    dietaryPreferences: ['Vegetariano'],
    active: true
  },
  { 
    id: '3', 
    name: 'Roberto Pai', 
    email: 'roberto@email.com', 
    role: TipoUsuario.PARENT, 
    balance: 150.00,
    profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80',
    active: true
  },
  { 
    id: '4', 
    name: 'Func', 
    email: 'funcionario@escola.edu', 
    role: TipoUsuario.STAFF, 
    balance: 0,
    profileImage: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80',
    active: true
  },
  { 
    id: '5', 
    name: 'Admin Cantina', 
    email: 'admin@escola.edu', 
    role: TipoUsuario.ADMIN, 
    balance: 0,
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    active: true
  },
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

  const login = async (username: string, password: string): Promise<any> => {
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
          foundUser.success = true;
          localStorage.setItem('cantinaUser', JSON.stringify(foundUser));
          setIsLoading(false);
          resolve(foundUser);
        } else {
          setIsLoading(false);
          resolve({success: false});
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cantinaUser');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('cantinaUser', JSON.stringify(updatedUser));
    }
  };

  const addBalance = (amount: number) => {
    if (user && user.balance !== undefined) {
      updateUser({ balance: user.balance + amount });
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    addBalance
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
