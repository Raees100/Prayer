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
      pathname: `/EshaPage`,
      params: {
        isCompleted: String(prayers[1].isCompleted),
        status: prayers[1].status,
        currentDate: String(currentDate),
      },
    });
  }
};

const MaghribPage = () => {
  const { isCompleted, status, currentDate } = useLocalSearchParams();
  const { datesArray, currentDateIndex } = useNamaz();
  const [prayerStatus, setPrayerStatus] = useState<string>(
      Array.isArray(status) ? status[0] : status || ''
    );
    const [prayerCompleted, setPrayerCompleted] = useState<boolean>(
      Array.isArray(isCompleted) ? isCompleted[0] === "true" : isCompleted === "true"
    );

  const fetchPrayerStatus = async () => {
      try {
        // Only fetch if we don't have status from route params
        if (!status || !isCompleted) {
          const response = await prayerApi.getPrayerByType("maghrib", new Date(currentDate as string));
          if (response) {
            setPrayerStatus(response.status);
            setPrayerCompleted(response.isCompleted);
          }
        }
      } catch (error) {
        console.error("Error fetching prayer status:", error);
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
      prayerName="Maghrib"
      isCompleted={prayerCompleted}
      status={prayerStatus}
    />
  </GestureDetector> 
  )
};

export default MaghribPage;