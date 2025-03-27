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
  const flatListRef = useRef<FlatList>(null);
  const [prayers] = React.useState<Prayer[]>([
    { id: 1, name: 'Fajar', status: '', isCompleted: false },
    { id: 2, name: 'Zuhr', status: '', isCompleted: false },
    { id: 3, name: 'Asar', status: '', isCompleted: false },
    { id: 4, name: 'Magrib', status: '', isCompleted: false },
    { id: 5, name: 'Esha', status: '', isCompleted: false },
  ]);

  const [datesArray, setDatesArray] = React.useState<DateItem[]>(() => {
    const dates = [];
    const baseDate = new Date();
    for (let i = -10; i <= 10; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      dates.push({
        date: new Date(date),
        prayers: prayers.map(p => ({ ...p }))
      });
    }
    return dates;
  });

  const navigateToCalendar = () => {
    navigation.navigate('Calendar', { currentDate });
  };

  const togglePrayer = (dateIndex: number, prayerId: number) => {
    setDatesArray(prevDates => {
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
    setDatesArray(prevDates => {
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

  const currentDateIndex = useRef(10);
  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      const currentPrayers = datesArray[currentDateIndex.current].prayers;
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
    currentDateIndex.current = index;
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
              rightComponent={
                <TouchableOpacity
                  onPress={navigateToCalendar}
                  style={{ padding: 8 }}
                >
                  <Icon name="calendar-today" size={24} color="#000" />
                </TouchableOpacity>
              }
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