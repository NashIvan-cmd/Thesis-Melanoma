import { View, Text } from 'react-native';
import React, { useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { useNavigation } from 'expo-router';
import { useMoleDataStore } from '@/services/moleStore';


const MoleDetails = () => {
  const navigation = useNavigation();
  const selectedMole = useMoleDataStore((state) => state.selectedMole);
  const setSelectedMoleToNull = useMoleDataStore((state)=> state.setSelectedMoleToNull);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      // When the screen is focused:
      return () => {
        // When the screen is unfocused, reset selectedMole to null
        setSelectedMoleToNull();
      };
    }, [setSelectedMoleToNull])
  );
  
  console.log({ selectedMole });
  return (
    <View className='flex-1 p-5'>
      <View className='items-center'>
        <Text>Big Image</Text>
        <Text>Your Skin Health Timeline</Text>
        <Text>{selectedMole?.body_part || "Identify part"}</Text>
        <Text>Assessment e.g. benign or malignant</Text>
        <Text>Assessment Date</Text>
      </View>
      <View>
      </View>
    </View>
  )
}

export default MoleDetails