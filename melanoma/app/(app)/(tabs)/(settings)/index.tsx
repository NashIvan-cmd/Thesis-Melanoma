import { Text, View } from 'react-native';
import { router } from 'expo-router';

import { useSession } from '@/services/authContext';

export default function SignOut() {
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
                  signOut();
                  // Navigate after signing in. You may want to tweak this to ensure sign-in is
                  // successful before navigating.
                  router.replace('../../sign-in');
                }}>
        Sign Out
      </Text>
    </View>
  );
}
