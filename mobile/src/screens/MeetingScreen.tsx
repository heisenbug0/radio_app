import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Call, StreamCall, useStreamVideoClient, CallContent, CallControls } from '@stream-io/video-react-native-sdk';
import { useRoute, RouteProp } from '@react-navigation/native';
import ErrorView from '../components/ErrorView';

interface RouteParams { callId: string; personal?: boolean; }
interface ChatMessage { id: string; message: string; userId: string; userName: string; }

export default function MeetingScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { callId } = route.params as RouteParams;
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!client) return;
      setError(null);
      try {
        const c = client.call('default', callId);
        await c.join();
        if (!mounted) return;
        setCall(c);
        const sub = c.on('custom', (event: any) => {
          const payload = event.custom;
          if (payload?.type === 'chat_message') {
            setMessages((prev) => (prev.some((m) => m.id === payload.messageId) ? prev : [...prev, {
              id: payload.messageId,
              message: payload.message,
              userId: event.user?.id ?? 'unknown',
              userName: event.user?.name ?? 'Unknown',
            }]));
          }
        });
        return () => sub?.();
      } catch (e) {
        setError('Failed to join meeting');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [client, callId]);

  const sendMessage = async () => {
    if (!call || !input.trim()) return;
    try {
      const messageId = Math.random().toString(36).slice(2);
      await call.sendCustomEvent({ type: 'chat_message', message: input.trim(), messageId });
      setInput('');
    } catch (e) {
      setError('Failed to send message');
    }
  };

  if (error) return <ErrorView message={error} onRetry={() => setError(null)} />;
  if (loading || !call) return <View style={{ flex: 1, backgroundColor: '#1C1F2E', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'white' }}>Loading call...</Text></View>;

  return (
    <StreamCall call={call}>
      <View style={{ flex: 1, backgroundColor: '#1C1F2E' }}>
        <CallContent />
        <View style={{ padding: 8 }}>
          <CallControls />
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={{ maxHeight: 240, borderTopColor: '#252A41', borderTopWidth: 1 }}>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ padding: 8 }}>
                  <Text style={{ color: '#C9DDFF' }}>{item.userName}</Text>
                  <Text style={{ color: '#FFFFFF' }}>{item.message}</Text>
                </View>
              )}
            />
            <View style={{ flexDirection: 'row', padding: 8, alignItems: 'center', gap: 8 }}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type a message"
                placeholderTextColor="#C9DDFF"
                style={{ flex: 1, borderColor: '#252A41', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, color: 'white' }}
              />
              <TouchableOpacity onPress={sendMessage} style={{ paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#0E78F9', borderRadius: 8 }}>
                <Text style={{ color: 'white' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </StreamCall>
  );
}