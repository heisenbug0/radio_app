import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function ErrorView({ title = 'Something went wrong', message, onRetry }: { title?: string; message?: string; onRetry?: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#1C1F2E', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: '#FFFFFF', fontSize: 20, marginBottom: 8, textAlign: 'center' }}>{title}</Text>
      {!!message && <Text style={{ color: '#C9DDFF', textAlign: 'center', marginBottom: 16 }}>{message}</Text>}
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={{ backgroundColor: '#0E78F9', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
          <Text style={{ color: '#FFFFFF' }}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}