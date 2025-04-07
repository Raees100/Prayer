import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import PrayerCalendar from '../components/Calendar';
import { useNavigation } from 'expo-router';
import { prayerApi } from '../services/prayerApi';

interface PrayerDay {
  allPrayersOffered: boolean;
  date: string;
}

interface PrayerData {
  [date: string]: PrayerDay;
}

const CalendarPage: React.FC = () => {
  const navigation = useNavigation();
  const [prayerData, setPrayerData] = useState<PrayerData>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrayerData = async () => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // JavaScript months are 0-based

        const data = await prayerApi.getPrayerCalendar(year, month);
        setPrayerData(data);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to load prayer data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerData();
  }, []); 

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Prayer Calendar',
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: '#000000',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <PrayerCalendar prayerData={prayerData} />
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
