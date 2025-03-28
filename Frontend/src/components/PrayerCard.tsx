import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface PrayerCardProps {
  name: string;
  status: string;
  isCompleted: boolean;
  onPress: () => void;
  onStatusChange?: (newStatus: string) => void;
  onViewDetails: () => void;
}

const PrayerCard: React.FC<PrayerCardProps> = ({
  name,
  status,
  isCompleted,
  onPress,
  onStatusChange,
  onViewDetails,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return '#22C55E';
      case 'Qaza':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          flex: 1,
          marginLeft: 4
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isCompleted ? '#22C55E' : 'transparent',
            borderWidth: isCompleted ? 0 : 1,
            borderColor: '#D1D5DB',
          }}
        >
          {isCompleted && (
            <Text style={{ color: '#FFFFFF', fontSize: 14 }}>✓</Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 18, color: '#000000' }}>{name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {status && (
              <Text style={{ color: getStatusColor(status), fontSize: 14 }}>
                ({status})
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TouchableOpacity
          onPress={() => onStatusChange?.('On Time')}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 4,
            backgroundColor: status === 'On Time' ? '#22C55E' : '#E5E7EB',
          }}
        >
          <Text style={{ 
            color: status === 'On Time' ? '#FFFFFF' : '#374151',
            fontSize: 12,
            fontWeight: '500'
          }}>
            On Time
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onStatusChange?.('Qaza')}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 4,
            backgroundColor: status === 'Qaza' ? '#EF4444' : '#E5E7EB',
          }}
        >
          <Text style={{ 
            color: status === 'Qaza' ? '#FFFFFF' : '#374151',
            fontSize: 12,
            fontWeight: '500'
          }}>
            Qaza
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrayerCard; 