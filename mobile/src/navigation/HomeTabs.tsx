import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import UpcomingScreen from '../screens/UpcomingScreen';
import PreviousScreen from '../screens/PreviousScreen';
import RecordingsScreen from '../screens/RecordingsScreen';
import PersonalRoomScreen from '../screens/PersonalRoomScreen';

const Tabs = createBottomTabNavigator();

const Icon = ({ label }: { label: string }) => (
  <Text style={{ color: '#ECF0FF', fontSize: 11 }}>{label.charAt(0)}</Text>
);

export default function HomeTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#1F2339' }, tabBarActiveTintColor: '#0E78F9' }}>
      <Tabs.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home', tabBarIcon: () => <Icon label="H" /> }} />
      <Tabs.Screen name="Upcoming" component={UpcomingScreen} options={{ tabBarIcon: () => <Icon label="U" /> }} />
      <Tabs.Screen name="Previous" component={PreviousScreen} options={{ tabBarIcon: () => <Icon label="P" /> }} />
      <Tabs.Screen name="Recordings" component={RecordingsScreen} options={{ tabBarIcon: () => <Icon label="R" /> }} />
      <Tabs.Screen name="PersonalRoom" component={PersonalRoomScreen} options={{ title: 'Personal', tabBarIcon: () => <Icon label="Pr" /> }} />
    </Tabs.Navigator>
  );
}