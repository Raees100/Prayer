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
  if (prayers.length > 1) {
    router.push({
      pathname: `/AsarPage`,
      params: {
        isCompleted: String(prayers[1].isCompleted),
        status: prayers[1].status,
        currentDate: String(currentDate),
      },
    });
  }
};

const ZuhrPage = () => {
  const { isCompleted, status, currentDate } = useLocalSearchParams();
  const { datesArray, currentDateIndex } = useNamaz();
  
  const [prayerData, setPrayerData] = useState({
    status: '',
    isCompleted: false
  });

  const fetchPrayerStatus = async () => {
    try {
      // First check route params
      if (status && isCompleted !== undefined) {
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
      const response = await prayerApi.getPrayerByType("zuhr", dateObj);
      
      if (response) {
        setPrayerData({
          status: response.status || '',
          isCompleted: response.isCompleted // Use the isCompleted flag directly from API
        });
        console.log('Zuhr status:', response.status, 'Completed:', response.isCompleted);
      } else {
        // If no record found, consider it as skipped
        setPrayerData({
          status: '',
          isCompleted: false
        });
        console.log('No Zuhr prayer record found - marking as skipped');
      }
    } catch (error) {
      console.error("Error fetching Zuhr prayer:", error);
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
        prayerName="Zuhr"
        isCompleted={prayerData.isCompleted}
        status={prayerData.status}
      />
    </GestureDetector>
  );
};

export default ZuhrPage;