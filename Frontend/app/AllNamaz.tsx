import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import UserHeader from '../components/UserHeader';
import PrayerCard from '../components/PrayerCard';
import { router } from 'expo-router';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';

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

  const togglePrayerCompletion = (prayerId: string) => {
    const updatedPrayers = prayers.map((prayer) =>
      prayer.id === prayerId ? { ...prayer, isCompleted: !prayer.isCompleted } : prayer
    );
    setPrayers(updatedPrayers);
  };

  const handleAddPrayer = () => {
    setPrayers((prevPrayers) => [
      ...prevPrayers,
      { id: `new${prevPrayers.length + 1}`, name: 'New Prayer', isCompleted: false, status: 'pending' },
    ]);
  };

  const swipeLeft = Gesture.Fling().direction(Directions.LEFT).onEnd(() => {
    console.log("Swiped left");
  });

  const swipeRight = Gesture.Fling().direction(Directions.RIGHT).onEnd(() => {
    console.log("Swiped Right");
    router.push('/CalendarPage');
  });

  return (
    <GestureDetector gesture={Gesture.Race(swipeLeft, swipeRight)}>
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
                onStatusChange={(newStatus) => {}}
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