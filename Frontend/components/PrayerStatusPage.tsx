import React from 'react';
import { View, Text, Image } from 'react-native';
import UserHeader from './UserHeader';
import PrayerIllustration from './PrayerIllustration';
import { styles } from '../styles/styles';
import { useDate } from '../context/DateContext';

interface PrayerStatusPageProps {
  prayerName: string;
  isCompleted: boolean;
  status: string; // This should be either 'Qaza', 'On Time', or empty
}

const PrayerStatusPage: React.FC<PrayerStatusPageProps> = ({
  prayerName,
  isCompleted,
  status,
}) => {
  const { currentDate } = useDate();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  const getPrayerIcon = (name: string) => {
    switch (name) {
      case 'Fajar':
        return require('../assets/icons/fajr.png');
      case 'Zuhr':
        return require('../assets/icons/zuhr.png');
      case 'Asar':
        return require('../assets/icons/asar.png');
      case 'Magrib':
        return require('../assets/icons/maghrib.png');
      case 'Esha':
        return require('../assets/icons/esha.png');
      default:
        return require('../assets/icons/fajr.png');
    }
  };

  // Determine what to display based on status and isCompleted
  const getStatusDisplay = () => {
    // Handle skipped prayers first
    if (!isCompleted) {
      return {
        iconColor: '#C70039',
        checkmark: '✕',
        bgColor: '#C70039',
        text: `Skipped ${prayerName}`,
        borderColor: '#D5B3C3'
      };
    }
  
    // Handle completed prayers
    switch (status) {
      case 'Qaza':
        return {
          iconColor: '#059669',
          checkmark: '✓',
          bgColor: '#059669',
          text: `Qaza ${prayerName}`,
          borderColor: '#0376387A'
        };
      case 'On Time':
      default:
        return {
          iconColor: '#059669',
          checkmark: '✓',
          bgColor: '#059669',
          text: `On Time ${prayerName}`,
          borderColor: '#0376387A'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={{ paddingTop: -50 }}>
        <UserHeader
          username="User name"
          subtitle="Lorem Ipsum"
          onMenuPress={() => {}}
        />
      </View>

      <Text style={{
        fontSize: 35,
        color: '#000000',
        textAlign: 'center',
        marginVertical: 40,
        fontWeight: 'bold',
        marginTop: -5,
      }}>
        {formatDate(currentDate)}
      </Text>

      <PrayerIllustration />

      <View style={{ alignItems: 'center', marginTop: 80 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Image 
            source={getPrayerIcon(prayerName)}
            style={{ 
              width: 40, 
              height: 40, 
              marginRight: 10,
              tintColor: '#037638'
            }} 
          />
          <Text style={{ 
            fontSize: 45, 
            color: '#037638', 
            fontWeight: '400',
            fontFamily: 'Sedan SC',
            marginRight: 50,
          }}>
            {prayerName}
          </Text>
        </View>

        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          borderWidth: 3,
          borderColor: statusDisplay.borderColor,
        }}>
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: statusDisplay.bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 32 }}>
              {statusDisplay.checkmark}
            </Text>
          </View>
        </View>
        <Text style={{ 
          fontSize: 24, 
          color: '#000000',
          marginBottom: 130,
          fontWeight: '500',
          paddingTop: status === 'Qaza' ? 0 : 30,
        }}>
          {statusDisplay.text}
        </Text>
      </View>
    </View>
  );
};

export default PrayerStatusPage;