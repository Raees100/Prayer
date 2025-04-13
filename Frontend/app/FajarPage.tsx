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
      if (status && isCompleted !== undefined) {
        setPrayerData({
          status: Array.isArray(status) ? status[0] : status,
          isCompleted: Array.isArray(isCompleted) 
            ? isCompleted[0] === "true" 
            : isCompleted === "true"
        });
        return;
      }
  
      const dateObj = new Date(currentDate as string);
      const response = await prayerApi.getPrayerByType("Fajar", dateObj);
      console.log("API Response:", response);
  
      if (!response || !response.status) {
        console.log("No valid prayer record found. Treating as Skipped.");
        setPrayerData({ status: 'Skipped', isCompleted: false });
      } else {
        console.log("Prayer record found:", response);
        setPrayerData({
          status: response.status,
          isCompleted: response.isCompleted
        });
      }
    } catch (error) {
      console.error("Error fetching Fajar prayer:", error);
      setPrayerData({ status: '', isCompleted: false });
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