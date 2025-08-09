import { Text } from 'react-native';
import { Redirect, Stack, Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useSession } from '@/services/authContext';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SessionProvider } from '@/services/authContext';

export default function RootLayout() {
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#25292e' }}>
          <StatusBar style="light" backgroundColor="#25292e" />
          <GluestackUIProvider mode="light">
            <AuthNavigator />
          </GluestackUIProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SessionProvider>
  );
}

function AuthNavigator() {
  const { session, isLoading } = useSession();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        // User is authenticated - show private routes
        <Stack.Screen name="(app)" />
      ) : (
        // User is not authenticated - show public routes
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}