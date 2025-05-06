import { View, Text } from 'react-native';
import React from 'react';

import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';

const Instructions = () => {

  const navigateNext = () => {
    router.navigate("/(app)/(tabs)/(photo)/imageSourceSelect")
  }
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        How to take an accurate photo:
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        1. Ensure the mole is centered in the camera and is the sole focus of the frame.
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        2. Take the photo in a bright environment with good lighting—avoid shadows or dim light.
      </Text>
      <Text style={{ fontSize: 16 }}>
        3. Make sure the camera is focused and the image is sharp before capturing.
      </Text>

      <ButtonGlue onPress={navigateNext}>
        <ButtonText>Next</ButtonText>
      </ButtonGlue>
    </View>
  );
};

export default Instructions;
