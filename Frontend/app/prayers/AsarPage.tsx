import React, { useLayoutEffect } from 'react';
import PrayerStatusPage from '../../components/PrayerStatusPage';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDate } from '../../context/DateContext';
import { useNamaz } from '../../context/NamazContext';
import { router, useLocalSearchParams } from 'expo-router';

interface Prayer {
  id: number;
  name: string;
  status: string;
  isCompleted: boolean;
}

const AsarPage = () => {
  const { isCompleted, status } = useLocalSearchParams();
  const { currentDate, setCurrentDate } = useDate();
  const { datesArray, setDatesArray, currentDateIndex } = useNamaz();
      const navigateToPrayerPage = (prayer: Prayer) => {
           const screenName = prayer.name as '/prayers/FajarPage' | '/prayers/ZuhrPage' | '/prayers/AsarPage' | '/prayers/MagribPage' | '/prayers/EshaPage';
           router.push({
             pathname: screenName, // Directly pass the string, not an object
             params: {
               isCompleted: String(prayer.isCompleted),
               status: prayer.status,
               currentDate: String(currentDate),
             },
           });
         };

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      const currentPrayers = datesArray[currentDateIndex].prayers;
      console.log(currentPrayers);    
      navigateToPrayerPage(currentPrayers[3]); // Change to your screen name
    });

  return (
    <GestureDetector gesture={swipeLeft}>
    <PrayerStatusPage
      prayerName="Asar"
      isCompleted={isCompleted === "true"} // Convert to boolean
      status={status.toLocaleString()}
    />
  </GestureDetector>
  );
};

export default AsarPage;