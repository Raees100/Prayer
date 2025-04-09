import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import PrayerCalendar from '../components/Calendar';
import { useNavigation } from 'expo-router';
import { prayerApi } from '../services/prayerApi';

interface CalendarDay {
  date: string;
  status: "cross" | "tick" | "";
}

const CalendarPage: React.FC = () => {
  const navigation = useNavigation();
  const [prayerData, setPrayerData] = useState<Record<string, { allPrayersOffered: boolean }>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchPrayerData = async (year: number, month: number) => {
    try {
      setLoading(true);
      const data = await prayerApi.getPrayerCalendar(year, month);
      
      // Transform backend data to frontend format
      const transformedData = data.reduce((acc, day) => {
        acc[day.date] = {
          allPrayersOffered: day.status === "tick"
        };
        return acc;
      }, {} as Record<string, { allPrayersOffered: boolean }>);
      
      setPrayerData(transformedData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load prayer data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    fetchPrayerData(year, month);
  }, [currentMonth]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Prayer Calendar',
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: '#000000',
    });
  }, [navigation]);

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <PrayerCalendar 
          prayerData={prayerData} 
          onMonthChange={handleMonthChange}
          currentMonth={currentMonth}
        />
      )}
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