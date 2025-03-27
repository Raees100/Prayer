import React from 'react';
import PrayerStatusPage from '../../components/PrayerStatusPage';
import { AsarScreenProps, RootStackParamList } from '../../navigation/types';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDate } from '../../context/DateContext';
import { useNamaz } from '../../context/NamazContext';

interface Prayer {
  id: number;
  name: string;
  status: string;
  isCompleted: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AsarPage: React.FC<AsarScreenProps> = ({ route }) => {
  const { isCompleted, status } = route.params;
  const { currentDate, setCurrentDate } = useDate();
  const navigation = useNavigation<NavigationProp>();
  const { datesArray, setDatesArray, currentDateIndex } = useNamaz();
     const navigateToPrayerPage = (prayer: Prayer) => {
       const screenName = prayer.name as 'Fajar' | 'Zuhr' | 'Asar' | 'Magrib' | 'Esha';
       navigation.navigate(screenName, {
         isCompleted: prayer.isCompleted,
         status: prayer.status,
         currentDate: currentDate
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
        isCompleted={isCompleted}
        status={status}
      />
    </GestureDetector>
  );
};

export default AsarPage;