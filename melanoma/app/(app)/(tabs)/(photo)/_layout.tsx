import { Stack } from 'expo-router';

export default function PhotoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="addSpot_screen" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}