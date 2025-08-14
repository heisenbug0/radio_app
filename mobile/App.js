import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator, Text, LogBox } from 'react-native';
import { useFonts } from 'expo-font';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-native-sdk';

import SignInScreen from './src/screens/SignInScreen';
import HomeTabs from './src/navigation/HomeTabs';
import MeetingScreen from './src/screens/MeetingScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

// Suppress non-critical warnings
LogBox.ignoreLogs([
  'Warning: Cannot update a component',
  'Warning: Can\'t perform a React state update',
]);

const Stack = createNativeStackNavigator();

const colors = {
  dark_0: '#1C1F2E',
  dark_1: '#161925',
  dark_2: '#1F2339',
  dark_3: '#252A41',
  light_0: '#FFFFFF',
  light_1: '#C9DDFF',
  light_2: '#ECF0FF',
  other_0: '#FF742E',
  other_1: '#F9A90E',
  other_2: '#0E78F9',
  other_3: '#830EF9',
};

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.dark_0,
    card: colors.dark_2,
    text: colors.light_0,
    border: colors.dark_3,
    primary: colors.other_2,
  },
};

// Secure token storage interface
const createSecureStorage = () => ({
  async getItem(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`SecureStore getItem error for key ${key}:`, error);
      return null;
    }
  },
  async setItem(key, value) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn(`SecureStore setItem error for key ${key}:`, error);
    }
  },
  async removeItem(key) {
    try {
      return await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`SecureStore removeItem error for key ${key}:`, error);
    }
  },
});

// Loading component with proper error handling
const Loading = ({ message = 'Loading...' }) => (
  <View style={{ 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: colors.dark_0 
  }}>
    <ActivityIndicator size="large" color={colors.other_2} />
    <Text style={{ 
      color: colors.light_0, 
      marginTop: 16, 
      fontSize: 16 
    }}>
      {message}
    </Text>
  </View>
);

// Error component with retry functionality
const ErrorDisplay = ({ error, onRetry }) => (
  <View style={{ 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: colors.dark_0 
  }}>
    <Text style={{ 
      color: colors.other_0, 
      fontSize: 16, 
      textAlign: 'center', 
      marginHorizontal: 20 
    }}>
      {error}
    </Text>
    <Text 
      style={{ 
        color: colors.light_0, 
        fontSize: 14, 
        marginTop: 16, 
        textAlign: 'center', 
        marginHorizontal: 20 
      }}
      onPress={onRetry}
    >
      Tap to retry
    </Text>
  </View>
);

// Main authenticated app component
const AuthenticatedApp = () => {
  const { getToken } = useAuth();
  const [streamClient, setStreamClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeStreamClient = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get authenticated token from Clerk
      const clerkToken = await getToken({ template: "afrimeet-mobile" });
      if (!clerkToken) {
        throw new Error('Authentication failed');
      }

      // Fetch Stream token from secure serverless endpoint
      const tokenResponse = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/stream/token`, {
        headers: {
          'Authorization': `Bearer ${clerkToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!tokenResponse.ok) {
        throw new Error(`Stream token request failed: ${tokenResponse.status}`);
      }

      const { token } = await tokenResponse.json();
      
      // Initialize Stream client with secure token
      const client = new StreamVideoClient({
        apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY,
        user: { id: 'me' },
        token,
      });

      setStreamClient(client);
    } catch (err) {
      console.error('Stream client initialization error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    // Ensure React Native is fully initialized before making network calls
    const initTimer = setTimeout(initializeStreamClient, 150);
    return () => clearTimeout(initTimer);
  }, [initializeStreamClient]);

  useEffect(() => {
    return () => {
      if (streamClient) {
        try {
          streamClient.disconnectUser?.();
        } catch (error) {
          console.warn('Stream client disconnect error:', error);
        }
      }
    };
  }, [streamClient]);

  if (isLoading) {
    return <Loading message="Initializing video service..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={initializeStreamClient} />;
  }

  if (!streamClient) {
    return <Loading message="Setting up video service..." />;
  }

  return (
    <StreamVideo client={streamClient}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="Meeting" component={MeetingScreen} />
      </Stack.Navigator>
    </StreamVideo>
  );
};

// Main App component
export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_sans_bold: require('./assets/fonts/NunitoSans_10pt-Bold.ttf'),
    Nunito_sans_extrabold: require('./assets/fonts/NunitoSans_10pt-ExtraBold.ttf'),
    Nunito_sans_regular: require('./assets/fonts/NunitoSans_10pt-Regular.ttf'),
    Nunito_sans_medium: require('./assets/fonts/NunitoSans_10pt-Medium.ttf'),
    Nunito_sans_semibold: require('./assets/fonts/NunitoSans_10pt-SemiBold.ttf'),
    Nunito_sans_light: require('./assets/fonts/NunitoSans_10pt-Light.ttf'),
    Nunito_sans_black: require('./assets/fonts/NunitoSans_10pt-Black.ttf'),
  });

  const secureStorage = useMemo(createSecureStorage, []);

  if (!fontsLoaded) {
    return <Loading message="Loading..." />;
  }

  return (
    <ClerkProvider 
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={secureStorage}
    >
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <SignedOut>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
            </Stack.Navigator>
          </SignedOut>
          <SignedIn>
            <AuthenticatedApp />
          </SignedIn>
        </NavigationContainer>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
