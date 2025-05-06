import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Svg, Circle, Path } from 'react-native-svg';

import { useSession } from '@/services/authContext';

import { Pressable } from 'react-native';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SignOut() {
  const { signOut } = useSession();

  const routerNavigate = (route: string) => {
    router.navigate(`/(settings)/${route}` as any);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Profile Header with SVG and User Info */}
        <View className="w-full flex flex-row items-center justify-start px-6 py-6 mb-4">
          <View className="mr-4">
            <Svg width="80" height="80" viewBox="0 0 80 80">
              <Circle cx="40" cy="30" r="20" fill="#D1D5DB" />
              <Path 
                d="M40,55 C24.536,55 12,67.536 12,83 L68,83 C68,67.536 55.464,55 40,55 Z" 
                fill="#D1D5DB"
                transform="translate(0, -18)"
              />
            </Svg>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">Username</Text>
            <Text className="text-gray-500">user@example.com</Text>
          </View>
        </View>
        
        <View className="flex flex-row w-90 mt-2 mb-4 gap-4 pl-4 pr-4">
          <Pressable
            onPress={() => routerNavigate("profileEdit")}
            className="flex-1 max-w-50 h-36 bg-blue-500 rounded-xl justify-center items-center"
          >
            <Text className="text-white font-semibold text-lg text-center">
              Edit Profile
            </Text>
          </Pressable>

          <Pressable
            onPress={() => routerNavigate("fitzpatrick")}
            className="flex-1 max-w-50 h-36 bg-green-500 rounded-xl justify-center items-center"
          >
            <Text className="text-white font-semibold text-lg text-center">
              FitzPatrick Test
            </Text>
          </Pressable>
        </View>

        <View className="flex flex-row w-90 gap-4 pl-4 pr-4">
          <Pressable
            onPress={() => routerNavigate("termsOfService")}
            className="flex-1 max-w-50 h-36 bg-yellow-500 rounded-xl justify-center items-center"
          >
            <Text className="text-white font-semibold text-lg text-center">
              App Policy
            </Text>
          </Pressable>

          <Pressable
            onPress={() => routerNavigate("deleteAccount")}
            className="flex-1 max-w-50 h-36 bg-red-500 rounded-xl justify-center items-center"
          >
            <Text className="text-white font-semibold text-lg text-center">
              Delete Account
            </Text>
          </Pressable>
        </View>
        
        <ButtonGlue
          size='lg'
          className="w-80 mt-10 bg-transparent !bg-transparent border border-red-500 active:!bg-red-500"
          onPress={() => { 
            signOut(); 
            router.replace('../../sign-in'); 
          }}
        >
          <ButtonText className="text-black">Sign Out</ButtonText>
        </ButtonGlue>
      </View>
    </View>
  );
}