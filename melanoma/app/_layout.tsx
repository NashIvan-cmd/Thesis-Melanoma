import { Slot } from 'expo-router';
import { SessionProvider } from '@/services/authContext';

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <GluestackUIProvider mode='light'>
      <Slot />
      </GluestackUIProvider>
    </SessionProvider>
  );
}
