import React from 'react'
import { View, Text } from "react-native";
import { Image } from "expo-image";

import { Button as ButtonGlue, ButtonText } from "@/components/ui/button";
import { useSession } from '@/services/authContext';

const ImagePreview = () => {
    // I think I must add some checker here for sure
    const { accessToken, userId } = useSession();

  const processImage = async() => {
    try {
        
    } catch (error) {
        
    }
  }

  return (
    <View>
      <Text>ImagePreview</Text>
        <ButtonGlue onPress={processImage}>
            <ButtonText>Process Image</ButtonText>
        </ButtonGlue>
        <ButtonGlue>
            <ButtonText>Cancel</ButtonText>
        </ButtonGlue>
    </View>
  )
}

export default ImagePreview