import React from 'react';
import PrayerStatusPage from '../../components/PrayerStatusPage';
import { useLocalSearchParams } from 'expo-router';

const EshaPage = () => {
  const { isCompleted, status } = useLocalSearchParams();
  
  return (
    <PrayerStatusPage
      prayerName="Esha"
      isCompleted={isCompleted === "true"} // Convert to boolean
      status={status.toLocaleString()}
    />
  );
};

export default EshaPage; 