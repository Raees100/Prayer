import React from 'react';
import PrayerStatusPage from '../../components/PrayerStatusPage';
import { EshaScreenProps } from '../../navigation/types';

const EshaPage: React.FC<EshaScreenProps> = ({ route }) => {
  const { isCompleted, status } = route.params;
  
  return (
    <PrayerStatusPage
      prayerName="Esha"
      isCompleted={isCompleted}
      status={status}
    />
  );
};

export default EshaPage; 