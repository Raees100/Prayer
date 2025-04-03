import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  setDatesArray: any;
  toggleCompletion: (title: string, date: string) => void;
  currentDateIndex: any;
   setCurrentDateIndex:any;
}

// Create the context with default undefined value
const NamazContext = createContext<NamazContextType | undefined>(undefined);

// Create a provider component
export const NamazProvider = ({ children }: { children: ReactNode }) => {
   const [prayers, setPrayers] = React.useState<Prayer[]>([
      { id: 1, name: 'Fajar', status: '', isCompleted: false },
      { id: 2, name: 'Zuhr', status: '', isCompleted: false },
      { id: 3, name: 'Asar', status: '', isCompleted: false },
      { id: 4, name: 'Magrib', status: '', isCompleted: false },
      { id: 5, name: 'Esha', status: '', isCompleted: false },
    ]);

    const [currentDateIndex, setCurrentDateIndex] = useState(10);

    const [datesArray, setDatesArray] = React.useState<DateItem[]>(() => {
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
        return dates;
      });

  // Function to toggle isCompleted for a specific date
  const toggleCompletion = (name: string) => {
    setPrayers((prevList) =>
      prevList.map((item) =>
        item.name === name 
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      )
    );
  };

  return (
    <NamazContext.Provider value={{ prayers, toggleCompletion, datesArray, setDatesArray, currentDateIndex, setCurrentDateIndex }}>
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
