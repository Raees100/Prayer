import React, {useState, useEffect} from 'react';
import PrayerStatusPage from '../../components/PrayerStatusPage';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDate } from '../../context/DateContext';
import { useNamaz } from '../../context/NamazContext';
import { router, useLocalSearchParams } from 'expo-router';
import {prayerApi} from '../../services/prayerApi';

interface Prayer {
  id: number;
  name: string;
  status: string;
  isCompleted: boolean;
}
const MagribPage = () => {
  const { isCompleted, status } = useLocalSearchParams();
  const { currentDate, setCurrentDate } = useDate();
  const { datesArray, setDatesArray, currentDateIndex } = useNamaz();
  // State to store fetched prayer status
  const [prayerStatus, setPrayerStatus] = useState<string>(
    Array.isArray(status) ? status[0] : status || ''); 
  const [prayerCompleted, setPrayerCompleted] = useState<boolean>(
    Array.isArray(isCompleted) ? isCompleted[0] === "true" : isCompleted === "true");
    
      const fetchPrayerStatus = async () => {
        try {
          const response = await prayerApi.getPrayerByType("Magrib", currentDate);
          if (response) {
            setPrayerStatus(response.status);
            setPrayerCompleted(response.isCompleted);
          }
        } catch (error) {
          console.error("Error fetching prayer status:", error);
        }
      };
    
      // Fetch prayer status when the component mounts or currentDate changes
      useEffect(() => {
        fetchPrayerStatus();
      }, [currentDate]);

  const navigateToPrayerPage = (prayer: Prayer) => {
    const screenName = prayer.name as '/prayers/FajarPage' | '/prayers/ZuhrPage' | '/prayers/AsarPage' | '/prayers/MagribPage' | '/prayers/EshaPage';
    router.push({
      pathname: screenName, 
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
      if (currentPrayers.length > 4) {
        navigateToPrayerPage(currentPrayers[4]); 
      }    
   });


  return (
    <GestureDetector gesture={swipeLeft}>
      <PrayerStatusPage
        prayerName="Magrib"
        isCompleted={prayerCompleted} 
        status={status.toLocaleString()}
      />
    </GestureDetector>
  );
};

export default MagribPage;