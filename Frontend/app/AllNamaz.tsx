import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image, Dimensions, Alert } from 'react-native';
import UserHeader from '../components/UserHeader';
import PrayerCard from '../components/PrayerCard';
import { router } from 'expo-router';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { prayerApi, PrayerRecord } from '../services/prayerApi';

const { height } = Dimensions.get('window');

interface Prayer {
  id: string;
  name: string;
  isCompleted: boolean;
  status: string;
}

const AllNamaz = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prayers, setPrayers] = useState<Prayer[]>([
    { id: 'fajar', name: 'Fajar', isCompleted: false, status: '' },
    { id: 'zuhr', name: 'Zuhr', isCompleted: false, status: '' },
    { id: 'asar', name: 'Asar', isCompleted: false, status: '' },
    { id: 'maghrib', name: 'Maghrib', isCompleted: false, status: '' },
    { id: 'esha', name: 'Esha', isCompleted: false, status: '' },
  ]); 

  useEffect(() => {
    const fetchExistingRecord = async () => {
      try {
        const record = await prayerApi.getPrayerByDate(currentDate);
        if (record) {
          setPrayers(prayers.map((prayer) => ({
            ...prayer,
            status: record.request[prayer.id] || '', 
            isCompleted: record.request[prayer.id] ? true : false, 
          })));
        } else {
          resetPrayers();
        }
      } catch (error) {
        console.error('Error fetching existing prayer record:', error);
      }
    };

    fetchExistingRecord();
  }, [currentDate]);

  const togglePrayerCompletion = (prayerId: string) => {
    const updatedPrayers = prayers.map((prayer) => {
      if (prayer.id === prayerId) {
        const newIsCompleted = !prayer.isCompleted;
        return {
          ...prayer,
          isCompleted: newIsCompleted,
          status: newIsCompleted ? prayer.status : '', 
        };
      }
      return prayer;
    });
    setPrayers(updatedPrayers);
  };

  const updatePrayerStatus = (prayerId: string, newStatus: string) => {
    setPrayers((prevPrayers) =>
      prevPrayers.map((prayer) =>
        prayer.id === prayerId ? { ...prayer, status: newStatus, isCompleted: true } : prayer
      )
    );
  };

  const resetPrayers = () => {
    setPrayers([
      { id: 'fajar', name: 'Fajar', isCompleted: false, status: '' },
      { id: 'zuhr', name: 'Zuhr', isCompleted: false, status: '' },
      { id: 'asar', name: 'Asar', isCompleted: false, status: '' },
      { id: 'maghrib', name: 'Maghrib', isCompleted: false, status: '' },
      { id: 'esha', name: 'Esha', isCompleted: false, status: '' },
    ]);
  };

  const handleAddPrayer = async () => {
    const prayerData: PrayerRecord = {
      request: {
        prayerDate: currentDate.toISOString(),
        fajar: prayers.find((prayer) => prayer.id === 'fajar')?.status || 'skipped',
        zuhr: prayers.find((prayer) => prayer.id === 'zuhr')?.status || 'skipped',
        asar: prayers.find((prayer) => prayer.id === 'asar')?.status || 'skipped',
        maghrib: prayers.find((prayer) => prayer.id === 'maghrib')?.status || 'skipped',
        esha: prayers.find((prayer) => prayer.id === 'esha')?.status || 'skipped',
      }
    };

    try {
      const existingRecord = await prayerApi.getPrayerByDate(currentDate); 
      if (existingRecord) {
        Alert.alert('Duplicate Data', 'Prayer record for today already exists.');
        return;
      }

      const result = await prayerApi.addPrayer(prayerData);
      console.log(result);
      Alert.alert('Success', 'Prayer record added successfully');
    } catch (error) {
      console.error("Error adding prayer data:", error);
      Alert.alert('Error', 'There was an issue adding the prayer record. Please try again.');
    }
  };

  const swipeLeft = Gesture.Fling().direction(Directions.LEFT).onEnd(() => {
    console.log("Swiped left");
    router.push('/prayers/FajarPage');
  });

  const swipeRight = Gesture.Fling().direction(Directions.RIGHT).onEnd(() => {
    console.log("Swiped Right");
    router.push('/CalendarPage');
  });

  const swipeUp = Gesture.Fling().direction(Directions.UP).onEnd(() => {
    console.log("Swiped Up - Moving to Next Date");
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1); 
    setCurrentDate(nextDate); 
    resetPrayers(); 
  });
  
  const swipeDown = Gesture.Fling().direction(Directions.DOWN).onEnd(() => {
    console.log("Swiped Down - Moving to Previous Date");
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1); 
    setCurrentDate(prevDate); 
  });
  

  return (
    <GestureDetector gesture={Gesture.Race(swipeUp, swipeDown, swipeLeft, swipeRight)}>
      <View style={styles.mainContainer}>
        <UserHeader
          username="User Name"
          subtitle="Welcome back!"
          onMenuPress={() => {}}
          currentDate={currentDate}
        />
        <Image source={require('../assets/images/cute-boy-moslem-prayer-cartoon.png')} style={styles.image} />
        <View style={styles.container}>
          <FlatList
            data={prayers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PrayerCard
                name={item.name}
                status={item.status}
                isCompleted={item.isCompleted}
                onPress={() => togglePrayerCompletion(item.id)}
                onStatusChange={(newStatus) => updatePrayerStatus(item.id, newStatus)}
                onViewDetails={() => {}}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => console.log('Edit button pressed')}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAddPrayer}>
            <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    marginTop: 40,
  },
  listContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 90,
    paddingVertical: 50,
    marginTop: -40,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AllNamaz;
