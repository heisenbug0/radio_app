import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useStreamVideoClient, Call } from '@stream-io/video-react-native-sdk';
import { useUser } from '@clerk/clerk-expo';

export default function UpcomingScreen() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!client || !user) return;
      setLoading(true);
      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [{ created_by_user_id: user.id }, { members: { $in: [user.id] } }],
          },
          limit: 20,
        });
        const now = new Date();
        setCalls(calls.filter((c) => c.state.startsAt && new Date(c.state.startsAt) > now));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [client, user?.id]);

  return (
    <View style={{ flex: 1, backgroundColor: '#1C1F2E', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 22, fontFamily: 'Nunito_sans_bold', marginBottom: 8 }}>Upcoming</Text>
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, backgroundColor: '#1F2339', borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ color: '#ECF0FF' }}>{item.id}</Text>
            <Text style={{ color: '#C9DDFF' }}>{item.state.startsAt}</Text>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={{ color: '#C9DDFF' }}>No upcoming</Text> : null}
      />
    </View>
  );
}