import React, { useRef, useMemo, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserHeader from '../components/UserHeader';
import PrayerCard from '../components/PrayerCard';
import PrayerIllustration from '../components/PrayerIllustration';
import { styles } from '../styles/styles';
import { AllNamazScreenProps, RootStackParamList } from '../navigation/types';
import { useDate } from '../context/DateContext';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNamaz } from '../context/NamazContext';

const { height } = Dimensions.get('window');

interface Prayer {
  id: number;
  name: string;
  status: string;
  isCompleted: boolean;
}

interface DateItem {
  date: Date;
  prayers: Prayer[];
}

const AllNamaz: React.FC<AllNamazScreenProps> = ({ navigation }) => {
  const { currentDate, setCurrentDate } = useDate();
  const { prayers, toggleCompletion, datesArray, setDatesArray, currentDateIndex, setCurrentDateIndex } = useNamaz();
  const flatListRef = useRef<FlatList>(null);

  const navigateToCalendar = () => {
    navigation.navigate('Calendar', { currentDate });
  };

  const togglePrayer = (dateIndex: number, prayerId: number) => {
    setDatesArray((prevDates: DateItem[]) => {
      const newDates = [...prevDates];
      const prayers = newDates[dateIndex].prayers;
      const prayerIndex = prayers.findIndex(p => p.id === prayerId);

      if (prayerIndex !== -1) {
        prayers[prayerIndex] = {
          ...prayers[prayerIndex],
          isCompleted: !prayers[prayerIndex].isCompleted,
          status: !prayers[prayerIndex].isCompleted ? prayers[prayerIndex].status : ''
        };
      }
      return newDates;
    });
  };

  const updatePrayerStatus = (dateIndex: number, prayerId: number, newStatus: string) => {
    setDatesArray((prevDates: DateItem[]) => {
      const newDates = [...prevDates];
      const prayers = newDates[dateIndex].prayers;
      const prayerIndex = prayers.findIndex(p => p.id === prayerId);

      if (prayerIndex !== -1) {
        prayers[prayerIndex] = {
          ...prayers[prayerIndex],
          status: newStatus,
          isCompleted: true
        };
      }
      return newDates;
    });
  };

  const navigateToPrayerPage = (prayer: Prayer) => {
    const screenName = prayer.name as 'Fajar' | 'Zuhr' | 'Asar' | 'Magrib' | 'Esha';
    navigation.navigate(screenName, {
      isCompleted: prayer.isCompleted,
      status: prayer.status,
      currentDate: currentDate
    });
  };

  const handleScroll = useCallback((event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / height);
    const newDate = new Date(datesArray[index].date);
    setCurrentDate(newDate);
  }, [datesArray]);

  
  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      const currentPrayers = datesArray[currentDateIndex].prayers;
      const selectedPrayer = currentPrayers.find(p => p.isCompleted && p.status);
      if (selectedPrayer) {
        navigateToPrayerPage(selectedPrayer);
      }
    });

  const swipeRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      navigateToCalendar();
    });

  const handleScrollEnd = useCallback((event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / height);
    setCurrentDateIndex(()=>index);
    const newDate = new Date(datesArray[index].date);
    setCurrentDate(newDate);
  }, [datesArray]);

  const renderPrayerScreen = ({ item, index }: { item: DateItem; index: number }) => {
    return (
      <GestureDetector gesture={Gesture.Race(swipeLeft, swipeRight)}>

        <View style={[styles.container, { height: height, backgroundColor: '#FFFFFF' }]}>
          <View style={{ paddingTop: 48 }}>
            <UserHeader
              username="User name"
              subtitle="Lorem Ipsum"
              onMenuPress={() => { }}
              currentDate={item.date}
            />
          </View>

          <PrayerIllustration />
          <View style={[styles.container, { paddingHorizontal: 16, paddingTop: 16, justifyContent: 'center' }]}>
            {item.prayers.map(prayer => (
              <PrayerCard
                key={prayer.id}
                name={prayer.name}
                status={prayer.status}
                isCompleted={prayer.isCompleted}
                onPress={() => togglePrayer(index, prayer.id)}
                onStatusChange={(newStatus) => updatePrayerStatus(index, prayer.id, newStatus)}
                onViewDetails={() => navigateToPrayerPage(prayer)}
              />
            ))}
          </View>
        </View>
      </GestureDetector>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={datesArray}
      renderItem={renderPrayerScreen}
      keyExtractor={(item) => item.date.toISOString()}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
      onMomentumScrollEnd={handleScrollEnd}
      initialScrollIndex={10}
      getItemLayout={(data, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );
};

export default AllNamaz;