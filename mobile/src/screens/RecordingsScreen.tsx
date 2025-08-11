import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import { useStreamVideoClient, Call, CallRecording } from '@stream-io/video-react-native-sdk';
import { useUser } from '@clerk/clerk-expo';

export default function RecordingsScreen() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!client || !user) return;
      setLoading(true);
      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            $or: [{ created_by_user_id: user.id }, { members: { $in: [user.id] } }],
          },
          limit: 20,
        });
        const all = await Promise.all(calls.map((c) => c.queryRecordings()));
        const recs = all.flatMap((r) => r.recordings);
        setRecordings(recs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [client, user?.id]);

  return (
    <View style={{ flex: 1, backgroundColor: '#1C1F2E', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 22, fontFamily: 'Nunito_sans_bold', marginBottom: 8 }}>Recordings</Text>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={{ padding: 12, backgroundColor: '#1F2339', borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ color: '#ECF0FF' }}>{item.filename}</Text>
            <Text style={{ color: '#C9DDFF' }}>{item.start_time}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading ? <Text style={{ color: '#C9DDFF' }}>No recordings</Text> : null}
      />
    </View>
  );
}