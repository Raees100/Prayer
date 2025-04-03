import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { prayerApi, PrayerRecord } from '../services/prayerApi';
import UserHeader from '../components/UserHeader';
import PrayerCard from '../components/PrayerCard';
import { useNavigation } from 'expo-router';

interface Prayer {
  id: string;
  name: string;
  time: string;
  isCompleted: boolean;
  status: string;
}

interface DateItem {
  date: Date;
  isSelected: boolean;
}

const AllNamaz: React.FC = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrayers();
  }, [currentDate]);

  const loadPrayers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get prayer record for current date
      const prayerRecord = await prayerApi.getPrayerByDate(currentDate);
      
      if (prayerRecord) {
        // Convert backend data to frontend format
        const formattedPrayers: Prayer[] = [
          { id: 'fajar', name: 'Fajar', time: prayerRecord.fajar, isCompleted: false, status: '' },
          { id: 'zuhr', name: 'Zuhr', time: prayerRecord.zuhr, isCompleted: false, status: '' },
          { id: 'asar', name: 'Asar', time: prayerRecord.asar, isCompleted: false, status: '' },
          { id: 'maghrib', name: 'Maghrib', time: prayerRecord.maghrib, isCompleted: false, status: '' },
          { id: 'esha', name: 'Esha', time: prayerRecord.esha, isCompleted: false, status: '' },
        ];

        // Get completion status for each prayer
        for (const prayer of formattedPrayers) {
          const status = await prayerApi.getPrayerByType(prayer.id, currentDate);
          if (status) {
            prayer.isCompleted = status.status === 'Completed';
            prayer.status = status.status;
          }
        }

        setPrayers(formattedPrayers);
      } else {
        // If no record exists, create default prayers
        setPrayers([
          { id: 'fajar', name: 'Fajar', time: '5:30 AM', isCompleted: false, status: '' },
          { id: 'zuhr', name: 'Zuhr', time: '1:30 PM', isCompleted: false, status: '' },
          { id: 'asar', name: 'Asar', time: '4:30 PM', isCompleted: false, status: '' },
          { id: 'maghrib', name: 'Maghrib', time: '7:30 PM', isCompleted: false, status: '' },
          { id: 'esha', name: 'Esha', time: '9:30 PM', isCompleted: false, status: '' },
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load prayers');
    } finally {
      setLoading(false);
    }
  };

  const togglePrayerCompletion = async (prayerId: string) => {
    try {
      const updatedPrayers = prayers.map(prayer => {
        if (prayer.id === prayerId) {
          return { ...prayer, isCompleted: !prayer.isCompleted };
        }
        return prayer;
      });
      setPrayers(updatedPrayers);

      // Update backend
      const prayer = prayers.find(p => p.id === prayerId);
      if (prayer) {
        const prayerRecord: PrayerRecord = {
          prayerDate: currentDate,
          fajar: prayers.find(p => p.id === 'fajar')?.time || '',
          zuhr: prayers.find(p => p.id === 'zuhr')?.time || '',
          asar: prayers.find(p => p.id === 'asar')?.time || '',
          maghrib: prayers.find(p => p.id === 'maghrib')?.time || '',
          esha: prayers.find(p => p.id === 'esha')?.time || '',
        };

        await prayerApi.updatePrayer(prayerRecord);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update prayer status');
      // Revert the UI state on error
      loadPrayers();
    }
  };

  const updatePrayerStatus = async (prayerId: string, newStatus: string) => {
    try {
      const updatedPrayers = prayers.map(prayer => {
        if (prayer.id === prayerId) {
          return { ...prayer, status: newStatus, isCompleted: true };
        }
        return prayer;
      });
      setPrayers(updatedPrayers);

      // Update backend
      const prayer = prayers.find(p => p.id === prayerId);
      if (prayer) {
        const prayerRecord: PrayerRecord = {
          prayerDate: currentDate,
          fajar: prayers.find(p => p.id === 'fajar')?.time || '',
          zuhr: prayers.find(p => p.id === 'zuhr')?.time || '',
          asar: prayers.find(p => p.id === 'asar')?.time || '',
          maghrib: prayers.find(p => p.id === 'maghrib')?.time || '',
          esha: prayers.find(p => p.id === 'esha')?.time || '',
        };

        await prayerApi.updatePrayer(prayerRecord);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update prayer status');
      // Revert the UI state on error
      loadPrayers();
    }
  };

  const renderPrayerScreen = () => (
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
  );

  return (
    <View style={styles.mainContainer}>
      <UserHeader
        username="User Name"
        subtitle="Welcome back!"
        onMenuPress={() => {}}
        currentDate={currentDate}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading prayers...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPrayers}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderPrayerScreen()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AllNamaz;