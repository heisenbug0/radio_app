import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-native-sdk';

import SignInScreen from './src/screens/SignInScreen';
import HomeTabs from './src/navigation/HomeTabs';
import MeetingScreen from './src/screens/MeetingScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

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

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL; // web serverless base
const [streamApiKey, setStreamApiKey] = React.useState(undefined);

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.dark_0 }}>
      <ActivityIndicator size="large" color={colors.other_2} />
    </View>
  );
}

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
  const [streamClient, setStreamClient] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        // fetch public config
        const cfg = await fetch(`${apiBaseUrl}/api/stream/config`).then((r) => r.json());
        if (!cfg?.stream_api_key) return;
        if (isMounted) setStreamApiKey(cfg.stream_api_key);
        // request token with Bearer Clerk session token if present
        const tokenResp = await fetch(`${apiBaseUrl}/api/stream/token`, {
          headers: {
            // Clerk Expo automatically attaches auth to fetch if using fetch with signedIn? If not, we can inject token via getToken if needed.
          },
        }).then((r) => r.json());
        const token = tokenResp?.token;
        if (!token) return;
        const client = new StreamVideoClient({
          apiKey: cfg.stream_api_key,
          user: { id: 'me' },
          token,
        });
        if (isMounted) setStreamClient(client);
      } catch (e) {
        // handled in UI
      }
    }
    init();
    return () => {
      isMounted = false;
      if (streamClient) streamClient.disconnectUser?.();
    };
  }, [apiBaseUrl]);

  const storage = useMemo(
    () => ({
      async getItem(key) {
        return SecureStore.getItemAsync(key);
      },
      async setItem(key, value) {
        return SecureStore.setItemAsync(key, value);
      },
      async removeItem(key) {
        return SecureStore.deleteItemAsync(key);
      },
    }),
    []
  );

  if (!fontsLoaded) return <Loading />;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={storage}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <SignedOut>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
            </Stack.Navigator>
          </SignedOut>
          <SignedIn>
            {streamClient ? (
              <StreamVideo client={streamClient}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Home" component={HomeTabs} />
                  <Stack.Screen name="Meeting" component={MeetingScreen} />
                </Stack.Navigator>
              </StreamVideo>
            ) : (
              <Loading />
            )}
          </SignedIn>
        </NavigationContainer>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
