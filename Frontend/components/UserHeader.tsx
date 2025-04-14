import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface UserHeaderProps {
  subtitle: string;
  onMenuPress: () => void;
  currentDate?: Date;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  subtitle,
  onMenuPress,
  currentDate,
}) => {
  const { userName } = useAuth();
  const formattedDate = currentDate ? new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(currentDate) : '';

  return (
    <View style={{ paddingTop: 16, paddingBottom: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 4 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#059669', overflow: 'hidden' }}>
            <Image
              source={require('../assets/images/cute-boy-moslem-prayer-cartoon.png')}
              style={{ width: '100%', height: '100%', borderRadius: 24, borderWidth: 3, borderColor: 'green', backgroundColor: 'white' }}
              defaultSource={require('../assets/images/cute-boy-moslem-prayer-cartoon.png')}
            />
          </View>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '600', color: '#000000' }}>{userName || 'User'}</Text>
            <Text style={{ color: '#666666' }}>{subtitle}</Text>
          </View>
        </View>
        
          <TouchableOpacity
            onPress={onMenuPress}
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#E5E7EB' }}
          >
            <View style={{ gap: 4 }}>
              <View style={{ width: 20, height: 2, backgroundColor: '#000000', borderRadius: 1 }} />
              <View style={{ width: 20, height: 2, backgroundColor: '#000000', borderRadius: 1 }} />
              <View style={{ width: 20, height: 2, backgroundColor: '#000000', borderRadius: 1 }} />
            </View>
          </TouchableOpacity>

      </View>
      
      <View style={{ alignItems: 'center', marginTop: 50, marginBottom: -10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000' }}>{formattedDate}</Text>
      </View>
    </View>
  );
};

export default UserHeader; 