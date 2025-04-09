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
  if (prayers.length > 4) {
    router.push({
      pathname: `/EshaPage`,
      params: {
        isCompleted: String(prayers[4].isCompleted),
        status: prayers[4].status,
        currentDate: String(currentDate),
      },
    });
  }
};

const MagribPage = () => {
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
      const response = await prayerApi.getPrayerByType("Magrib", new Date(currentDate));
      if (response) {
        setPrayerStatus(response.status);
        setPrayerCompleted(response.isCompleted);
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
      runOnJS(handleLeftSwipe)(currentPrayers, currentDate);
    });

  return (
    <GestureDetector gesture={swipeLeft}>
      <PrayerStatusPage
        prayerName="Magrib"
        isCompleted={prayerCompleted}
        status={prayerStatus}
      />
    </GestureDetector>
  );
};

export default MagribPage;
