import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import UpcomingScreen from '../screens/UpcomingScreen';
import PreviousScreen from '../screens/PreviousScreen';
import RecordingsScreen from '../screens/RecordingsScreen';
import PersonalRoomScreen from '../screens/PersonalRoomScreen';

const Tabs = createBottomTabNavigator as any;

export default function HomeTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tabs.Screen name="Upcoming" component={UpcomingScreen} />
      <Tabs.Screen name="Previous" component={PreviousScreen} />
      <Tabs.Screen name="Recordings" component={RecordingsScreen} />
      <Tabs.Screen name="PersonalRoom" component={PersonalRoomScreen} options={{ title: 'Personal Room' }} />
    </Tabs.Navigator>
  );
}