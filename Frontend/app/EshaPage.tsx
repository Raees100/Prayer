import React, { useState, useEffect } from 'react';
import PrayerStatusPage from '../components/PrayerStatusPage';
import { useLocalSearchParams } from 'expo-router';
import { prayerApi } from '../services/prayerApi';

const EshaPage = () => {
  const { isCompleted, status, currentDate } = useLocalSearchParams();
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
          const response = await prayerApi.getPrayerByType("esha", new Date(currentDate as string));
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
  

  return (
    <PrayerStatusPage
      prayerName="Esha"
      isCompleted={prayerCompleted}
      status={prayerStatus}
    />
  )
};
export default EshaPage;