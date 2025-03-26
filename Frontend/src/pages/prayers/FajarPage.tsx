import React from 'react';
import PrayerStatusPage from '../../components/PrayerStatusPage';
import { FajarScreenProps, RootStackParamList } from '../../navigation/types';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDate } from '../../context/DateContext';
import { useNavigation } from '@react-navigation/native';

interface Prayer {
  id: number;
  name: string;
  status: string;
  isCompleted: boolean;
}

const FajarPage: React.FC<FajarScreenProps> = ({ route }) => {
  const { isCompleted, status } = route.params;
  const { currentDate, setCurrentDate } = useDate();
  const navigation = useNavigation();
   const [prayers] = React.useState<Prayer[]>([
      { id: 1, name: 'Fajar', status: '', isCompleted: false },
      { id: 2, name: 'Zuhr', status: '', isCompleted: false },
      { id: 3, name: 'Asar', status: '', isCompleted: false },
      { id: 4, name: 'Magrib', status: '', isCompleted: false },
      { id: 5, name: 'Esha', status: '', isCompleted: false },
    ]);
  const navigateToPrayerPage = (prayer: Prayer) => {
      const screenName = prayer.name as keyof Omit<RootStackParamList, 'AllNamaz' | 'Calendar'>;
      navigation.navigate(screenName, {
        isCompleted: prayer.isCompleted,
        status: prayer.status,
        currentDate: currentDate
      });
    };
  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      navigateToPrayerPage(prayers[1]); // Change to your screen name
    });

  return (
    <GestureDetector gesture={swipeLeft}>
    <PrayerStatusPage
      prayerName="Fajar"
      isCompleted={isCompleted}
      status={status}
    />
    </GestureDetector>
  );
};

export default FajarPage; 