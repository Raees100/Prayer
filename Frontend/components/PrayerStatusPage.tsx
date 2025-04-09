import React from 'react';
import { View, Text, Image } from 'react-native';
import UserHeader from './UserHeader';
import PrayerIllustration from './PrayerIllustration';
import { styles } from '../styles/styles';
import { useDate } from '../context/DateContext';

interface PrayerStatusPageProps {
  prayerName: string;
  isCompleted: boolean;
  status: string;
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

        {!isCompleted ? (
          <>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              borderWidth: 3,
              borderColor: '#D5B3C3',
            }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#C70039',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 32 }}>✕</Text>
              </View>
            </View>
            <Text style={{ 
              fontSize: 24, 
              color: '#000000',
              marginBottom: 130,
              fontWeight: '500',
            }}>
              Skipped {prayerName}
            </Text>
          </>
        ) : (
          <>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: '#0376387A',
            }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#059669',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 32 }}>✓</Text>
              </View>
            </View>
            <Text style={{ 
              fontSize: 24, 
              color: '#000000',
              marginBottom: 130,
              fontWeight: '500',
              paddingTop: 30,
            }}>
              {status === 'Qaza' ? `Qaza ${prayerName}` : `On Time ${prayerName}`}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default PrayerStatusPage; 