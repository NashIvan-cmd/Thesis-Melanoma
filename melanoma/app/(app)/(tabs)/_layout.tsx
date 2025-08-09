import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';

export default function TabLayout() {
  // Add debug logging
  console.log('TabLayout rendering...');

  // Medical-themed colors
  const activeColor = '#4caf50'; // Medical green
  const backgroundColor = '#ffffff'; // Clean white background
  const headerColor = '#f5f5f5'; // Light gray header
  const textColor = '#333333'; // Dark text for better readability

  return (
    <Tabs
      initialRouteName='index'
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: '#757575',
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerShadowVisible: false,
        headerTintColor: textColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          height: Platform.OS === 'android' ? 60 : 'auto',
          paddingBottom: Platform.OS === 'android' ? 8 : 'auto',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Health',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="symptoms" 
        options={{
          title: 'Symptoms',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'medkit' : 'medkit-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="(photo)"
        options={{
          title: 'Scan',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'scan' : 'scan-outline'} color={color} size={24} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="(settings)"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}