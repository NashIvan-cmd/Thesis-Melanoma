import React, { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { SessionProvider } from '@/services/authContext';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import LogoScreen from '@/components/LogoScreen'; // replace with actual path

// Prevent auto-hide (we'll manually hide it after LogoScreen)
SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      // Simulate loading time, fonts, async setup, etc.
      await new Promise(resolve => setTimeout(resolve, 2000)); // Fake loading
      setIsReady(true);
      await SplashScreen.hideAsync();
    };

    loadResources();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1 }}>
        <LogoScreen />
      </View>
    );
  }

  return (
    <SessionProvider>
      <GluestackUIProvider mode="light">
        <Slot />
      </GluestackUIProvider>
    </SessionProvider>
  );
}
