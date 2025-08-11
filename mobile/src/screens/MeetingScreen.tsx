import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Call,
  StreamCall,
  useStreamVideoClient,
  CallContent,
  CallControls,
  ParticipantsPanel,
  useCall,
} from '@stream-io/video-react-native-sdk';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';

interface RouteParams {
  callId: string;
  personal?: boolean;
}

interface ChatMessage {
  id: string;
  message: string;
  userId: string;
  userName: string;
}

export default function MeetingScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { callId } = route.params as RouteParams;
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { user } = useUser();

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!client) return;
      try {
        const c = client.call('default', callId);
        await c.join();
        if (!mounted) return;
        setCall(c);
        const sub = c.on('custom', (event: any) => {
          const payload = event.custom;
          if (payload?.type === 'chat_message') {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.messageId)) return prev;
              return [
                ...prev,
                {
                  id: payload.messageId,
                  message: payload.message,
                  userId: event.user?.id ?? 'unknown',
                  userName: event.user?.name ?? 'Unknown',
                },
              ];
            });
          }
        });
        return () => sub?.();
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [client, callId]);

  const sendMessage = async () => {
    if (!call || !input.trim()) return;
    const messageId = Math.random().toString(36).slice(2);
    await call.sendCustomEvent({ type: 'chat_message', message: input.trim(), messageId });
    setInput('');
  };

  if (loading || !call) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1C1F2E', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white' }}>Loading call...</Text>
      </View>
    );
  }

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
                  <Text style={{ color: '#C9DDFF', fontFamily: 'Nunito_sans_medium' }}>{item.userName}</Text>
                  <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_sans_regular' }}>{item.message}</Text>
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
                <Text style={{ color: 'white', fontFamily: 'Nunito_sans_medium' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </StreamCall>
  );
}