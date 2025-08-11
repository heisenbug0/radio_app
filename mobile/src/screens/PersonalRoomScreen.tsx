import React from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

export default function PersonalRoomScreen() {
  const { user } = useUser();
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || '';
  const meetingId = user?.id || '';
  const meetingLink = `${baseUrl}/meeting/${meetingId}?personal=true`;

  const onShare = async () => {
    try {
      await Share.share({ message: meetingLink });
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1C1F2E', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 22, fontFamily: 'Nunito_sans_bold', marginBottom: 8 }}>Personal Room</Text>
      <Text style={{ color: '#C9DDFF', marginBottom: 12 }}>{meetingLink}</Text>
      <TouchableOpacity onPress={onShare} style={{ backgroundColor: '#0E78F9', padding: 12, borderRadius: 8, width: 160 }}>
        <Text style={{ color: 'white', fontFamily: 'Nunito_sans_medium', textAlign: 'center' }}>Share Link</Text>
      </TouchableOpacity>
    </View>
  );
}