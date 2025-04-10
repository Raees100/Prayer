import React, { useState, useEffect } from 'react';
import PrayerStatusPage from '../components/PrayerStatusPage';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNamaz } from '../context/NamazContext';
import { router, useLocalSearchParams } from 'expo-router';
import { prayerApi } from '../services/prayerApi';
import { runOnJS } from 'react-native-reanimated';

interface Prayer {
  id: number;
  name: string;
  status: string;
  isCompleted: boolean;
}

const handleLeftSwipe = (prayers: Prayer[], currentDate: string) => {
  if (prayers.length > 1) {
    router.push({
      pathname: `/ZuhrPage`,
      params: {
        isCompleted: String(prayers[1].isCompleted),
        status: prayers[1].status,
        currentDate: String(currentDate),
      },
    });
  }
};

const FajarPage = () => {
  const { isCompleted, status, currentDate } = useLocalSearchParams();
  const { datesArray, currentDateIndex } = useNamaz();
  
  const [prayerData, setPrayerData] = useState({
    status: '',
    isCompleted: false
  });

  const fetchPrayerStatus = async () => {
    try {
      // First check route params (for immediate navigation)
      if (isCompleted !== undefined) {
        const completed = Array.isArray(isCompleted) 
          ? isCompleted[0] === "true" 
          : isCompleted === "true";
        
        setPrayerData({
          status: completed ? (Array.isArray(status) ? status[0] : status || 'On Time') : '',
          isCompleted: completed
        });
        return;
      }

      // Fetch from API if no params
      const dateObj = new Date(currentDate as string);
      const response = await prayerApi.getPrayerByType("fajar", dateObj);
      
      if (response) {
        setPrayerData({
          status: response.isCompleted ? (response.status || 'On Time') : '',
          isCompleted: response.isCompleted
        });
        console.log('Fajar status:', response.status, 'Completed:', response.isCompleted);
      } else {
        // No record found = skipped
        setPrayerData({
          status: '',
          isCompleted: false
        });
        console.log('No Fajar prayer record found - marking as skipped');
      }
    } catch (error) {
      console.error("Error fetching Fajar prayer:", error);
      // Consider it as skipped in case of error
      setPrayerData({
        status: '',
        isCompleted: false
      });
    }
  };

  useEffect(() => {
    fetchPrayerStatus();
  }, [currentDate]);

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      const currentPrayers = datesArray[currentDateIndex].prayers;
      runOnJS(handleLeftSwipe)(currentPrayers, currentDate as string);
    });

  return (
    <GestureDetector gesture={swipeLeft}>
      <PrayerStatusPage
        prayerName="Fajar"
        isCompleted={prayerData.isCompleted}
        status={prayerData.status}
      />
    </GestureDetector>
  );
};

export default FajarPage;