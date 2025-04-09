import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image, Dimensions, Alert } from 'react-native';
import UserHeader from '../components/UserHeader';
import PrayerCard from '../components/PrayerCard';
import { router } from 'expo-router';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { prayerApi, PrayerRecord } from '../services/prayerApi';
import { runOnJS } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

interface Prayer {
  id: string;
  name: string;
  isCompleted: boolean;
  status: string;
}

const AllNamaz = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
const [existingRecordId, setExistingRecordId] = useState<string | null>(null);
  const [prayers, setPrayers] = useState<Prayer[]>([
    { id: 'fajar', name: 'Fajar', isCompleted: false, status: '' },
    { id: 'zuhr', name: 'Zuhr', isCompleted: false, status: '' },
    { id: 'asar', name: 'Asar', isCompleted: false, status: '' },
    { id: 'maghrib', name: 'Maghrib', isCompleted: false, status: '' },
    { id: 'esha', name: 'Esha', isCompleted: false, status: '' },
  ]);

  const convertStatusToLabel = (status: number): string => {
    switch (status) {
      case 1: return 'On Time';
      case 2: return 'Qaza';
      default: return '';
    }
  };

  const convertLabelToStatus = (label: string): number => {
    switch (label) {
      case 'On Time': return 1;
      case 'Qaza': return 2;
      default: return 0;
    }
  };

  useEffect(() => {
    const fetchExistingRecord = async () => {
      try {
        const record = await prayerApi.getPrayerByDate(currentDate);
        if (record) {
          setPrayers(prayers.map((prayer) => ({
            ...prayer,
            status: convertStatusToLabel(record[prayer.id as keyof PrayerRecord]),
            isCompleted: record[prayer.id as keyof PrayerRecord] !== 0,
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

  const handleEditPrayer = async () => {
    try {
      const existingRecord = await prayerApi.getPrayerByDate(currentDate);
      if (existingRecord) {
        setPrayers(prayers.map((prayer) => ({
          ...prayer,
          status: convertStatusToLabel(existingRecord[prayer.id as keyof PrayerRecord]),
          isCompleted: existingRecord[prayer.id as keyof PrayerRecord] !== 0,
        })));
        setExistingRecordId(existingRecord.id);
        setIsEditing(true);
      } else {
        Alert.alert("No Record Found", "There is no record for this date.");
      }
    } catch (error) {
      console.error("Error fetching existing prayer record:", error);
      Alert.alert("Error", "Could not fetch prayer record.");
    }
  };
  
  const handleSavePrayer = async () => {
    const prayerData: PrayerRecord = {
      prayerDate: currentDate,
      fajar: convertLabelToStatus(prayers.find(p => p.id === 'fajar')?.status || ''),
      zuhr: convertLabelToStatus(prayers.find(p => p.id === 'zuhr')?.status || ''),
      asar: convertLabelToStatus(prayers.find(p => p.id === 'asar')?.status || ''),
      maghrib: convertLabelToStatus(prayers.find(p => p.id === 'maghrib')?.status || ''),
      esha: convertLabelToStatus(prayers.find(p => p.id === 'esha')?.status || ''),
    };
  
    try {
      if (isEditing && existingRecordId) {
        await prayerApi.updatePrayer(prayerData);
        Alert.alert("Success", "Prayer record updated successfully.");
        setIsEditing(false);
      } else {
        await prayerApi.addPrayer(prayerData);
        Alert.alert("Success", "Prayer record added successfully.");
      }
    } catch (error) {
      console.error("Error saving prayer record:", error);
      Alert.alert("Error", "There was an issue saving the prayer record.");
    }
  };
  const handleLeftSwipe = ()=>{
    router.push({
      pathname: '/FajarPage', // Directly pass the string, not an object
      params: {
        isCompleted: String(prayers[0].isCompleted),
        status: prayers[0].status,
        currentDate: currentDate.toISOString(),
      },
    });
  }
  const handleRightSwipe = ()=>{
    router.push('/CalendarPage');
  }
  const handleUpSwipe = ()=>{
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1); 
    setCurrentDate(nextDate);
    resetPrayers();
  }
  const handleDownSwipe = ()=>{
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1); 
    setCurrentDate(prevDate);
  }
  const swipeLeft = Gesture.Fling().direction(Directions.LEFT).onEnd(() => {
    runOnJS(handleLeftSwipe)()
  });
console.log(prayers[0].isCompleted, prayers[0].status, currentDate)
  const swipeRight = Gesture.Fling().direction(Directions.RIGHT).onEnd(() => {
    runOnJS(handleRightSwipe)()
  });

  const swipeUp = Gesture.Fling().direction(Directions.UP).onEnd(() => {
    runOnJS(handleUpSwipe)()
  });
  
  const swipeDown = Gesture.Fling().direction(Directions.DOWN).onEnd(() => {
    runOnJS(handleDownSwipe)()
  });

  return (
    <GestureDetector gesture= {Gesture.Race(swipeLeft, swipeRight, swipeUp, swipeDown)}>
      <View style={styles.mainContainer}>
        <UserHeader
          username="User Name"
          subtitle="Welcome back!"
          onMenuPress={() => {router.push('/FajarPage')}}
          currentDate={currentDate}
        />
        <Image 
          source={require('../assets/images/cute-boy-moslem-prayer-cartoon.png')} 
          style={styles.image} 
        />
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
          {!isEditing ? (
    <TouchableOpacity style={styles.button} onPress={handleEditPrayer}>
      <Text style={styles.buttonText}>Edit</Text>
    </TouchableOpacity>
  ) : null}
   <TouchableOpacity style={styles.button} onPress={handleSavePrayer}>
    <Text style={styles.buttonText}>{isEditing ? "Save" : "Add"}</Text>
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