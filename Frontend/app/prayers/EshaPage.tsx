import React, { useState, useEffect } from 'react';
import PrayerStatusPage from '../../components/PrayerStatusPage';
import { useLocalSearchParams } from 'expo-router';
import { prayerApi } from '../../services/prayerApi';
import { useDate } from '@/context/DateContext';


const EshaPage = () => {
  const { isCompleted, status } = useLocalSearchParams();
  const { currentDate, setCurrentDate } = useDate();
  // State to store fetched prayer status
  const [prayerStatus, setPrayerStatus] = useState<string>(
    Array.isArray(status) ? status[0] : status || '');
  const [prayerCompleted, setPrayerCompleted] = useState<boolean>(
    Array.isArray(isCompleted) ? isCompleted[0] === "true" : isCompleted === "true");

  const fetchPrayerStatus = async () => {
    try {
      const response = await prayerApi.getPrayerByType("Esha", currentDate);
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

  return (
    <PrayerStatusPage
      prayerName="Esha"
      isCompleted={prayerCompleted}
      status={status.toLocaleString()}
    />
  );
};

export default EshaPage; 