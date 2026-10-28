import React, { createContext, useContext, useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { personaProfiles } from '../data/mockData';

interface AuthContextType {
  role: UserRole;
  user: UserProfile;
  isAuthenticated: boolean;
  switchRole: (newRole: UserRole) => void;
  login: (role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('investor');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default authenticated for seamless demo, with login page toggle

  const user = personaProfiles[role] || personaProfiles.investor;

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const login = (selectedRole?: UserRole) => {
    if (selectedRole) {
      setRole(selectedRole);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ role, user, isAuthenticated, switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

