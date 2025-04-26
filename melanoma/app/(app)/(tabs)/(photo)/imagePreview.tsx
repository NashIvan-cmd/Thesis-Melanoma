import React from 'react'
import { View, Text } from "react-native";
import { Image } from "expo-image";

import { Button as ButtonGlue, ButtonText } from "@/components/ui/button";
import { useSession } from '@/services/authContext';
import { useImageStore } from '@/services/imageStore';
import { moleData } from '@/api/moleData';

const ImagePreview = () => {
    // I think I must add some checker here for sure
    const { accessToken, userId } = useSession();
    const { uri } = useImageStore.getState();

  const processImageRequest = async() => {
    try {
        if (!accessToken || !userId) {
          throw new Error("Incomplete credentials to make this request");
        }
        await moleData(accessToken, userId);
    } catch (error) {
        console.error("Error @ process image request", error);    
    }
  }

  return (
    <View>
      { uri ?
        <Image source={uri} style={{ width: '100%', height: '80%' }}/>
      : 
        <Text>There is no image yet</Text>
      }
        <ButtonGlue onPress={processImageRequest}>
            <ButtonText>Process Image</ButtonText>
        </ButtonGlue>
        <ButtonGlue>
            <ButtonText>Cancel</ButtonText>
        </ButtonGlue>
    </View>
  )
}

export default ImagePreview