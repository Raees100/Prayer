import React, { useState, useEffect } from 'react';
import PrayerStatusPage from '../components/PrayerStatusPage';
import { useLocalSearchParams } from 'expo-router';
import { prayerApi } from '../services/prayerApi';

const EshaPage = () => {
  const { isCompleted, status, currentDate } = useLocalSearchParams();
  
  const [prayerData, setPrayerData] = useState({
    status: '',
    isCompleted: false
  });

  const fetchPrayerStatus = async () => {
    try {
      if (status && isCompleted) {
        setPrayerData({
          status: Array.isArray(status) ? status[0] : status,
          isCompleted: Array.isArray(isCompleted) 
            ? isCompleted[0] === "true" 
            : isCompleted === "true"
        });
        return;
      }

      const dateObj = new Date(currentDate as string);
      const response = await prayerApi.getPrayerByType("esha", dateObj);
      
      if (response) {
        setPrayerData({
          status: response.status || '',
          isCompleted: response.status ? true : false
        });
      }
    } catch (error) {
      console.error("Error fetching Esha prayer:", error);
    }
  };

  useEffect(() => {
    fetchPrayerStatus();
  }, [currentDate]);

  return (
      <PrayerStatusPage
        prayerName="Esha"
        isCompleted={prayerData.isCompleted}
        status={prayerData.status}
        currentDate={currentDate as string}
      />
  );
};

export default EshaPage;