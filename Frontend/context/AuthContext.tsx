import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userId: string;
  userName: string;
  setUserData: (id: string, name: string) => void;
  loadUserData: () => Promise<void>;
  clearUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  const loadUserData = async () => {
    try {
      const storedId = await AsyncStorage.getItem('userId');
      const storedName = await AsyncStorage.getItem('userName');
      if (storedId && storedName) {
        setUserId(storedId);
        setUserName(storedName);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const setUserData = async (id: string, name: string) => {
    try {
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userName', name);
      setUserId(id);
      setUserName(name);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userName');
      setUserId('');
      setUserName('');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, userName, setUserData, loadUserData, clearUserData }}>
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