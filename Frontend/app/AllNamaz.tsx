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
        // Toggle completion status for the specific prayer
        const updatedPrayer = { ...prayer, isCompleted: !prayer.isCompleted };
  
        // Update the status based on isCompleted
        const updatedStatus = updatedPrayer.isCompleted ? 'completed' : 'pending';
        updatedPrayer.status = updatedStatus; // Ensure correct status is set
  
        // Create the prayer record for all prayers with updated status
        const prayerData: PrayerRecord = {
          prayerDate: currentDate, // Correct format of the prayer date
          fajar: prayers[0].status, // Status for Fajar prayer
          zuhr: prayers[1].status,  // Status for Zuhr prayer
          asar: prayers[2].status,  // Status for Asar prayer
          maghrib: prayers[3].status, // Status for Maghrib prayer
          esha: prayers[4].status,  // Status for Esha prayer
          userId: 'userId', // Replace with actual user ID if needed
        };
  
        console.log('Sending data to add/update prayer:', prayerData);
  
        // API call to add prayer if the prayer is marked as completed
        if (updatedPrayer.isCompleted) {
          prayerApi
            .addPrayer(prayerData)
            .then((response) => {
              console.log('Prayer added successfully:', response);
            })
            .catch((error) => {
              console.error('Error adding prayer:', error.response?.data || error.message);
            });
        } else {
          // API call to update prayer if the prayer is not completed
          prayerApi
            .updatePrayer(prayerData)
            .then((response) => {
              console.log('Prayer updated successfully:', response);
            })
            .catch((error) => {
              console.error('Error updating prayer:', error.response?.data || error.message);
            });
        }
  
        return updatedPrayer;
      }
      return prayer;
    });
  
    setPrayers(updatedPrayers);
  };

  const updatePrayerStatus = async (prayerId: string, newStatus: string) => {
    // Update the prayer state with the new status
    const updatedPrayers = prayers.map((prayer) => {
      if (prayer.id === prayerId) {
        const updatedPrayer = { ...prayer, status: newStatus, isCompleted: true };
  
        // Ensure the prayer record matches what the API expects
        const prayerRecord = {
          prayerDate: currentDate, // Correct format of the prayer date
          fajar: prayers[0].status, // Status for Fajar prayer
          zuhr: prayers[1].status,  // Status for Zuhr prayer
          asar: prayers[2].status,  // Status for Asar prayer
          maghrib: prayers[3].status, // Status for Maghrib prayer
          esha: prayers[4].status,  // Status for Esha prayer
          userId: 'userId', // Replace with actual user ID if needed
        };
  
        // API call to update prayer
        prayerApi
          .updatePrayer(prayerRecord)
          .then((response) => {
            console.log('Prayer updated successfully:', response);
          })
          .catch((error) => {
            console.error('Error updating prayer:', error.response?.data || error.message);
          });
  
        return updatedPrayer;
      }
      return prayer;
    });
  
    // Update the state with the new prayer statuses
    setPrayers(updatedPrayers);
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
              onStatusChange={(newStatus) => updatePrayerStatus(item.id, newStatus)}
              onViewDetails={() => {}}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
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
    marginTop: 70,
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
});

export default AllNamaz;
