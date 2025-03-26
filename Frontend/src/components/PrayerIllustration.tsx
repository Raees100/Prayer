import React from 'react';
import { View, Image } from 'react-native';
import { styles } from '../styles/styles';

const PrayerIllustration: React.FC = () => {
  return (
    <View style={[ { alignItems: 'center', justifyContent: 'center', marginTop: 40}]}>
      <Image
        source={require('../assets/images/cute-boy-moslem-prayer-cartoon.png')}
        style={{ width: '50%', height: 200, aspectRatio: 1, resizeMode: 'cover' }}
        resizeMode="cover"
      />
    </View>
  );
};

export default PrayerIllustration; 