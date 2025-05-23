import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Svg, Circle, Path } from 'react-native-svg';

import { useSession } from '@/services/authContext';

import { Pressable } from 'react-native';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SignOut() {
  const { signOut, username, email } = useSession();

  const routerNavigate = (route: string) => {
    router.navigate(`/(settings)/${route}` as any);
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 w-full px-4 py-6">
        {/* Profile Header with SVG and User Info */}
        <View className="w-full flex flex-row items-center justify-start px-4 py-6 mb-6 bg-white rounded-xl shadow-sm">
          <View className="mr-4">
            <Svg width="80" height="80" viewBox="0 0 80 80">
              <Circle cx="40" cy="30" r="20" fill="#4F46E5" opacity="0.2" />
              <Path 
                d="M40,55 C24.536,55 12,67.536 12,83 L68,83 C68,67.536 55.464,55 40,55 Z" 
                fill="#4F46E5"
                opacity="0.2"
                transform="translate(0, -18)"
              />
              <Circle cx="40" cy="30" r="19" stroke="#4F46E5" strokeWidth="2" fill="none" />
            </Svg>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">{username}</Text>
            <Text className="text-gray-500">{email}</Text>
          </View>
        </View>
        
        <Text className="text-lg font-semibold text-gray-700 mb-3 px-2">Account Settings</Text>
        
        <View className="flex flex-row w-full mb-4 gap-4">
          <Pressable
            onPress={() => routerNavigate("/editProfile/editProfile")}
            className="flex-1 h-36 bg-indigo-50 border border-indigo-200 rounded-xl justify-center items-center shadow-sm"
          >
            <View className="w-12 h-12 rounded-full bg-indigo-100 mb-2 items-center justify-center">
              <Text className="text-indigo-600 text-xl">👤</Text>
            </View>
            <Text className="text-indigo-700 font-semibold text-base text-center">
              Edit Profile
            </Text>
          </Pressable>

          <Pressable
            onPress={() => routerNavigate("fitzpatrick")}
            className="flex-1 h-36 bg-teal-50 border border-teal-200 rounded-xl justify-center items-center shadow-sm"
          >
            <View className="w-12 h-12 rounded-full bg-teal-100 mb-2 items-center justify-center">
              <Text className="text-teal-600 text-xl">🔬</Text>
            </View>
            <Text className="text-teal-700 font-semibold text-base text-center">
              FitzPatrick Test & Melanoma History
            </Text>
          </Pressable>
        </View>

        <Text className="text-lg font-semibold text-gray-700 mb-3 px-2">App Settings</Text>

        <View className="flex flex-row w-full gap-4">
          <Pressable
            onPress={() => routerNavigate("termsOfService")}
            className="flex-1 h-36 bg-amber-50 border border-amber-200 rounded-xl justify-center items-center shadow-sm"
          >
            <View className="w-12 h-12 rounded-full bg-amber-100 mb-2 items-center justify-center">
              <Text className="text-amber-600 text-xl">📋</Text>
            </View>
            <Text className="text-amber-700 font-semibold text-base text-center">
              App Policy
            </Text>
          </Pressable>

          <Pressable
            onPress={() => routerNavigate("deleteAccount")}
            className="flex-1 h-36 bg-rose-50 border border-rose-200 rounded-xl justify-center items-center shadow-sm"
          >
            <View className="w-12 h-12 rounded-full bg-rose-100 mb-2 items-center justify-center">
              <Text className="text-rose-600 text-xl">❌</Text>
            </View>
            <Text className="text-rose-700 font-semibold text-base text-center">
              Delete Account
            </Text>
          </Pressable>
        </View>
        
        <View className="flex-1 items-center justify-end pb-8">
          <ButtonGlue
            size="lg"
            className="w-80 mt-10 bg-transparent !bg-transparent border border-red-500 active:!bg-red-500"
            onPress={() => { 
              signOut(); 
              router.replace('../../sign-in'); 
            }}
          >
            <ButtonText className="text-rose-600 font-medium">Sign Out</ButtonText>
          </ButtonGlue>
        </View>
      </View>
    </View>
  );
}