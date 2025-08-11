import React from 'react';
import { View } from 'react-native';
import { SignIn } from '@clerk/clerk-expo';

export default function SignInScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1C1F2E', paddingTop: 48 }}>
      <SignIn />
    </View>
  );
}