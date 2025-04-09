import { View, Text } from 'react-native';
import React, { useEffect } from 'react';

import { useNavigation } from 'expo-router';


const MoleDetails = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View className='flex-1 p-5'>
      <View className='items-center'>
        <Text>Your Skin Health Timeline</Text>
        <Text>e.g Upper Back</Text>
      </View>
      <View>
      </View>
    </View>
  )
}

export default MoleDetails