import React, { useState, useEffect } from 'react';
import PrayerStatusPage from '../components/PrayerStatusPage';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router, useLocalSearchParams } from 'expo-router';
import { prayerApi } from '../services/prayerApi';
import { runOnJS } from 'react-native-reanimated';
import { useNamaz } from '@/context/NamazContext';

interface Prayer {
  id: number;
  name: string;
  status: string;
  isCompleted: boolean;
}
const handleLeftSwipe = (prayers: Prayer[], currentDate: string) => {
  if (prayers.length > 3) {
    router.push({
      pathname: `/MaghribPage`,
      params: {
        isCompleted: String(prayers[3].isCompleted),
        status: prayers[3].status,
        currentDate: String(currentDate),
      },
    });
  }
};

const AsarPage = () => {
  const { isCompleted, status, currentDate } = useLocalSearchParams();
  const { datesArray, currentDateIndex } = useNamaz();
  
  const [prayerData, setPrayerData] = useState({
    status: '',
    isCompleted: false
  });

  const fetchPrayerStatus = async () => {
    try {
      // First check route params
      if (status && isCompleted) {
        setPrayerData({
          status: Array.isArray(status) ? status[0] : status,
          isCompleted: Array.isArray(isCompleted) 
            ? isCompleted[0] === "true" 
            : isCompleted === "true"
        });
        return;
      }

      // If no params, fetch from API
      const dateObj = new Date(currentDate as string);
      const response = await prayerApi.getPrayerByType("asar", dateObj);
      
      if (response) {
        setPrayerData({
          status: response.status || '',
          isCompleted: !!response.status // Convert to boolean
        });
        console.log('Asar status:', response.status, 'Completed:', !!response.status);
      } else {
        console.log('No Asar prayer record found');
      }
    } catch (error) {
      console.error("Error fetching Asar prayer:", error);
      // Optional: Show error to user
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
        prayerName="Asar"
        isCompleted={prayerData.isCompleted}
        status={prayerData.status}
        currentDate={currentDate as string}
      />
    </GestureDetector>
  );
};

export default AsarPage;