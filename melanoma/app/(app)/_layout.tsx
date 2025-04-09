import { Text } from 'react-native';
import { Redirect, Stack, Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useSession } from '@/services/authContext';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SessionProvider } from '@/services/authContext';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#25292e' }}>
        <StatusBar style="light" backgroundColor="#25292e" />
        <GluestackUIProvider mode="light">
          <SessionProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              {/* <Stack.Screen name="+not-found" /> */}
            </Stack>
          </SessionProvider>
        </GluestackUIProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}
