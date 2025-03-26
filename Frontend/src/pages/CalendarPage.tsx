import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrayerCalendar from '../components/Calendar';
import { CalendarScreenProps } from '../navigation/types';

interface PrayerDay {
  allPrayersOffered: boolean;
  date: string;
}

interface PrayerData {
  [date: string]: PrayerDay;
}

const CalendarPage: React.FC = () => {
  const navigation = useNavigation<CalendarScreenProps['navigation']>();
  const [prayerData, setPrayerData] = useState<PrayerData>({});

  useEffect(() => {
    // This is sample data - replace with your actual prayer tracking data
    const currentDate = new Date();
    const dummyData: PrayerData = {};
    
    // Generate sample data for the current month
    for (let i = 1; i <= 31; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      if (date.getMonth() === currentDate.getMonth()) {
        const dateString = date.toISOString().split('T')[0];
        // Randomly set some prayers as completed for demonstration
        dummyData[dateString] = {
          allPrayersOffered: Math.random() > 0.5,
          date: dateString,
        };
      }
    }
    
    setPrayerData(dummyData);
  }, []);

  // Set up navigation options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Prayer Calendar',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#ffffff',
      },
      headerTintColor: '#000000',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <PrayerCalendar prayerData={prayerData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
});

export default CalendarPage; 