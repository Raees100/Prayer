import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userName: string;
  setUserName: (name: string) => void;
  loadUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState('');

  const loadUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSetUserName = async (name: string) => {
    try {
      await AsyncStorage.setItem('userName', name);
      setUserName(name);
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userName, setUserName: handleSetUserName, loadUserData }}>
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