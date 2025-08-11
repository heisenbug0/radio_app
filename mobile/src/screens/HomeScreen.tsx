import React, { useCallback, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, TextInput, Alert, useWindowDimensions } from 'react-native';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useUser } from '@clerk/clerk-expo';

export default function HomeScreen({ navigation }: any) {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [joinId, setJoinId] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const compact = width < 360;

  const startInstantMeeting = useCallback(async () => {
    if (!client || !user) return;
    setLoading(true);
    try {
      const id = user.id;
      const call = client.call('default', id);
      await call.getOrCreate({});
      navigation.navigate('Meeting', { callId: id, personal: true });
    } catch (e) {
      Alert.alert('Error', 'Failed to start meeting');
    } finally {
      setLoading(false);
    }
  }, [client, user]);

  const scheduleMeeting = useCallback(async () => {
    if (!client) return;
    setLoading(true);
    try {
      const id = Math.random().toString(36).slice(2);
      const call = client.call('default', id);
      const starts_at = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      await call.getOrCreate({ data: { starts_at, custom: { description: 'Scheduled from mobile' } } });
      Alert.alert('Scheduled', `ID: ${id}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to schedule');
    } finally {
      setLoading(false);
    }
  }, [client]);

  const joinMeeting = useCallback(async () => {
    if (!client || !joinId) return;
    try {
      const { calls } = await client.queryCalls({ filter_conditions: { id: joinId } });
      if (calls.length) navigation.navigate('Meeting', { callId: joinId });
      else Alert.alert('Not found', 'No meeting with that ID');
    } catch (e) {
      Alert.alert('Error', 'Failed to join');
    }
  }, [client, joinId]);

  return (
    <View style={{ flex: 1, backgroundColor: '#1C1F2E' }}>
      <ImageBackground source={require('../../assets/images/logo.png')} resizeMode="contain" style={{ height: 240, margin: 16, borderRadius: 16, overflow: 'hidden', padding: 16, backgroundColor: '#1F2339' }}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          {!compact && (
            <View style={{ alignSelf: 'flex-start', backgroundColor: '#1F2339', paddingHorizontal: 12, height: 36, borderRadius: 8, justifyContent: 'center' }}>
              <Text style={{ color: '#ECF0FF', fontFamily: 'Nunito_sans_regular' }}>Upcoming Meeting at: 12:30 PM</Text>
            </View>
          )}
          <View>
            <Text style={{ color: '#ECF0FF', fontSize: compact ? 36 : 48, fontFamily: 'Nunito_sans_extrabold' }}>12:30</Text>
            {!compact && (
              <Text style={{ color: '#ECF0FF', fontSize: 18, fontFamily: 'Nunito_sans_medium', textTransform: 'uppercase', marginTop: -8 }}>pm</Text>
            )}
            {!compact && (
              <Text style={{ color: '#ECF0FF', fontSize: 18, fontFamily: 'Nunito_sans_medium' }}>Friday, 29 March 2024</Text>
            )}
          </View>
        </View>
      </ImageBackground>

      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <TouchableOpacity onPress={startInstantMeeting} style={{ backgroundColor: '#FF742E', flexGrow: 1, padding: 16, borderRadius: 12, minWidth: '46%' }} disabled={loading}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_sans_bold', textTransform: 'capitalize' }}>{compact ? 'New' : 'new meeting'}</Text>
            {!compact && <Text style={{ color: '#FFFFFF', opacity: 0.85, fontFamily: 'Nunito_sans_regular' }}>Start an instant meeting</Text>}
          </TouchableOpacity>
          <View style={{ backgroundColor: '#0E78F9', flexGrow: 1, padding: 16, borderRadius: 12, minWidth: '46%' }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_sans_bold', textTransform: 'capitalize' }}>{compact ? 'Join' : 'join meeting'}</Text>
            <TextInput value={joinId} onChangeText={setJoinId} placeholder={compact ? 'ID' : 'Enter meeting ID'} placeholderTextColor="#C9DDFF" style={{ color: 'white', borderBottomColor: '#ECF0FF', borderBottomWidth: 1, paddingVertical: 6 }} />
            <TouchableOpacity onPress={joinMeeting} style={{ marginTop: 8, backgroundColor: '#1F2339', padding: 10, borderRadius: 6 }}>
              <Text style={{ color: '#ECF0FF', fontFamily: 'Nunito_sans_medium' }}>Join</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={scheduleMeeting} style={{ backgroundColor: '#830EF9', flexGrow: 1, padding: 16, borderRadius: 12, minWidth: '46%' }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_sans_bold', textTransform: 'capitalize' }}>{compact ? 'Sched.' : 'schedule meeting'}</Text>
            {!compact && <Text style={{ color: '#FFFFFF', opacity: 0.85, fontFamily: 'Nunito_sans_regular' }}>Plan your meeting</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Recordings')} style={{ backgroundColor: '#F9A90E', flexGrow: 1, padding: 16, borderRadius: 12, minWidth: '46%' }}>
            <Text style={{ color: '#1C1F2E', fontFamily: 'Nunito_sans_bold', textTransform: 'capitalize' }}>{compact ? 'Recs' : 'view recordings'}</Text>
            {!compact && <Text style={{ color: '#1C1F2E', opacity: 0.85, fontFamily: 'Nunito_sans_regular' }}>Meeting recordings</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}