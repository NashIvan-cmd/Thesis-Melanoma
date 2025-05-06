import { Stack } from "expo-router";
import { View, Text } from 'react-native';
import React from 'react';

const SettingsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="termsOfService" />
    </Stack>
  );
};

export default SettingsLayout;
