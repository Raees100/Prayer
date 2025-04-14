import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

// Define the structure of a Namaz item
interface NamazItem {
  title: string;
  isCompleted: boolean;
  date: string; // Store date as a string (e.g., '2024-03-28')
}

interface Prayer {
    id: number;
    name: string;
    status: string;
    isCompleted: boolean;
  }

  interface DateItem {
    date: Date;
    prayers: Prayer[];
  }
  

// Define the Context structure
interface NamazContextType {
  prayers: Prayer[];
  datesArray: DateItem[]; 
  setDatesArray: (dates: DateItem[]) => void;
  toggleCompletion: (name: string) => void;
  currentDateIndex: number;
  setCurrentDateIndex: (index: number) => void;
  saveUserData: () => Promise<void>;
  loadUserData: () => Promise<void>;
}

// Create the context with default undefined value
const NamazContext = createContext<NamazContextType | undefined>(undefined);

// Create a provider component
export const NamazProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const [prayers, setPrayers] = useState<Prayer[]>([
    { id: 1, name: 'Fajar', status: '', isCompleted: false },
    { id: 2, name: 'Zuhr', status: '', isCompleted: false },
    { id: 3, name: 'Asar', status: '', isCompleted: false },
    { id: 4, name: 'Magrib', status: '', isCompleted: false },
    { id: 5, name: 'Esha', status: '', isCompleted: false },
  ]);

  const [currentDateIndex, setCurrentDateIndex] = useState(10);
  const [datesArray, setDatesArray] = useState<DateItem[]>([]);

  // Initialize dates array
  useEffect(() => {
    if (datesArray.length === 0) {
      const dates = [];
      const baseDate = new Date();
      for (let i = -10; i <= 10; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        dates.push({
          date: new Date(date),
          prayers: prayers.map(p => ({ ...p }))
        });
      }
      setDatesArray(dates);
    }
  }, []);

  // Load user data when userId changes
  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const saveUserData = async () => {
    if (!userId) return;
    try {
      const userData = {
        prayers,
        datesArray,
        currentDateIndex
      };
      await AsyncStorage.setItem(`userData_${userId}`, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const loadUserData = async () => {
    if (!userId) return;
    try {
      const storedData = await AsyncStorage.getItem(`userData_${userId}`);
      if (storedData) {
        const { prayers: storedPrayers, datesArray: storedDates, currentDateIndex: storedIndex } = JSON.parse(storedData);
        setPrayers(storedPrayers);
        setDatesArray(storedDates);
        setCurrentDateIndex(storedIndex);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Function to toggle isCompleted for a specific date
  const toggleCompletion = (name: string) => {
    setPrayers((prevList) =>
      prevList.map((item) =>
        item.name === name 
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      )
    );
    saveUserData(); // Save after each toggle
  };

  return (
    <NamazContext.Provider value={{
      prayers,
      toggleCompletion,
      datesArray,
      setDatesArray,
      currentDateIndex,
      setCurrentDateIndex,
      saveUserData,
      loadUserData
    }}>
      {children}
    </NamazContext.Provider>
  );
};

// Custom hook for consuming the context
export const useNamaz = () => {
  const context = useContext(NamazContext);
  if (!context) {
    throw new Error('useNamaz must be used within a NamazProvider');
  }
  return context;
};

function setNamazList(arg0: (prevList: any) => any) {
    throw new Error('Function not implemented.');
}