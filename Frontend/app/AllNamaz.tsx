import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import UserHeader from '../components/UserHeader';
import PrayerCard from '../components/PrayerCard';
import { router } from 'expo-router';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { prayerApi, PrayerRecord } from '@/services/prayerApi';

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

  const togglePrayerCompletion = async (prayerId: string) => {
    const updatedPrayers = prayers.map((prayer) => {
      if (prayer.id === prayerId) {
        const updatedPrayer = { ...prayer, isCompleted: !prayer.isCompleted };
        const updatedStatus = updatedPrayer.isCompleted ? 'completed' : 'pending';
        updatedPrayer.status = updatedStatus;

        const prayerData: PrayerRecord = {
          prayerDate: currentDate,
          fajar: prayers[0].status,
          zuhr: prayers[1].status,
          asar: prayers[2].status,
          maghrib: prayers[3].status,
          esha: prayers[4].status,
          userId: 'userId',
        };

        if (updatedPrayer.isCompleted) {
          prayerApi.addPrayer(prayerData).then((response) => {
            console.log('Prayer added successfully:', response);
          }).catch((error) => {
            console.error('Error adding prayer:', error.response?.data || error.message);
          });
        } else {
          prayerApi.updatePrayer(prayerData).then((response) => {
            console.log('Prayer updated successfully:', response);
          }).catch((error) => {
            console.error('Error updating prayer:', error.response?.data || error.message);
          });
        }

        return updatedPrayer;
      }
      return prayer;
    });

    setPrayers(updatedPrayers);
  };

  // Function to handle the Add button press
  const handleAddPrayer = async () => {
    // Create a new prayer record to be added
    const newPrayerData: PrayerRecord = {
      prayerDate: currentDate,
      fajar: 'skipped', // Initial status can be 'pending'
      zuhr: 'skipped',
      asar: 'skipped',
      maghrib: 'skipped',
      esha: 'skipped',
      userId: 'userId', // Replace with actual user ID if needed
    };

    // Call the API to add the new prayer
    prayerApi.addPrayer(newPrayerData)
      .then((response) => {
        console.log('New prayer added successfully:', response);
        // You can update the state if needed to reflect the new prayer
        setPrayers((prevPrayers) => [
          ...prevPrayers,
          { id: 'newId', name: 'New Prayer', isCompleted: false, status: 'pending' },
        ]);
      })
      .catch((error) => {
        console.error('Error adding new prayer:', error.response?.data || error.message);
      });
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
