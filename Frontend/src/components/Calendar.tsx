import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Theme, MarkedDates } from 'react-native-calendars/src/types';

interface PrayerDay {
  allPrayersOffered: boolean;
  date: string;
}

interface CalendarProps {
  prayerData: { [date: string]: PrayerDay };
}

interface CustomDayProps {
  date?: DateData;
  marking?: any;
  state?: string;
}

const PrayerCalendar: React.FC<CalendarProps> = ({ prayerData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const markedDates: MarkedDates = Object.entries(prayerData).reduce((acc, [date, data]) => {
    const today = new Date();
    const currentDate = new Date(date);
    const isFutureDate = currentDate > today;

    return {
      ...acc,
      [date]: {
        marked: !isFutureDate,
        dotColor: 'transparent',
        selected: true,
        selectedColor: isFutureDate ? 'transparent' : (data.allPrayersOffered ? '#4CAF50' : '#F44336'),
        customStyles: {
          container: {
            backgroundColor: isFutureDate ? 'transparent' : (data.allPrayersOffered ? '#4CAF50' : '#F44336'),
            borderRadius: 20,
            borderWidth: isFutureDate ? 1 : 0,
            borderColor: '#ccc',
            height: 32,
            width: 32,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
          },
          text: {
            color: 'transparent',
          },
        },
      },
    };
  }, {});

  const theme: Partial<Theme> = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: 'transparent',
    selectedDayTextColor: '#000000',
    todayTextColor: '#000000',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    arrowColor: '#2d4150',
    monthTextColor: '#2d4150',
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 14,
  };

  const customTheme = {
    ...theme,
    'stylesheet.calendar.header': {
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 10,
      },
      monthText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginLeft: -20,
      },
      arrow: {
        padding: 10,
        top: -10,
      },
      week: {
        marginTop: 7,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      dayHeader: {
        marginTop: 2,
        marginBottom: 7,
        width: 32,
        textAlign: 'center',
        fontSize: 12,
        color: '#b6c1cd',
      },
    },
    'stylesheet.day.basic': {
      base: {
        height: 65,
        width: 32,
        alignItems: 'center',
      },
    },
  };

  const dayComponent = ({ date, marking }: CustomDayProps) => {
    if (!date) return null;
    
    const today = new Date();
    const currentDate = new Date(date.timestamp);
    const isFutureDate = currentDate > today;
    const isCompleted = marking?.selectedColor === '#4CAF50';
    
    return (
      <View style={styles.dayContainer}>
        <View style={[styles.iconContainer, marking?.customStyles?.container]}>
          {!isFutureDate && (
            <Text style={styles.icon}>
              {isCompleted ? '✓' : '✗'}
            </Text>
          )}
        </View>
        <Text style={styles.dateText}>
          {date.day}
        </Text>
      </View>
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <View style={styles.container}>
      <Calendar
        current={currentMonth.toISOString()}
        theme={customTheme}
        markedDates={markedDates}
        markingType="custom"
        onMonthChange={(month) => {
          const newDate = new Date(month.timestamp);
          setCurrentMonth(newDate);
        }}
        enableSwipeMonths={true}
        dayComponent={dayComponent}
        hideExtraDays={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayContainer: {
    height: 65,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  icon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#2d4150',
    marginTop: 4,
  },
});

export default PrayerCalendar; 