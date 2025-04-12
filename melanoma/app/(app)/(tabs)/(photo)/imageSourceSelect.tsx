import { View, Text, Platform } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';

interface ISelectorProps {
    x_coordinate: number,
    y_coordinate: number
}

import { Button as ButtonGlue, ButtonText } from '@/components/ui/button'
import { useImageStore } from '@/services/imageStore';
import { Image } from 'expo-image';
const ImageSourceSelector = () => {
    
    const { setImageData } = useImageStore();
    const takePicture = () => {
        router.navigate("/(app)/(tabs)/(photo)/camera");
    }
    const { uri } = useImageStore.getState();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        
        // Make sure the result is valid and the URI exists
        if (!result.canceled && result.assets && result.assets[0].uri) {
            const uri = result.assets[0].uri;  // Get the URI from the first asset
            console.log(uri);
            setImageData(uri);
        } else {
            console.error("Image picker failed or user cancelled.");
        }
    };

    const navigateToImagePreview = () => {
        router.navigate("/(app)/(tabs)/(photo)/imagePreview");
    }
    
    return (
    <View className='flex-1'>
        {uri ? 
            <Image source={uri} style={{ width: '100%', height: '70%' }} /> 
        :
         <Text>No URI provided</Text> 
        }
        {Platform.OS == 'ios' ?  
             <ButtonGlue >
             <ButtonText>Capture image coming soon. Please Upload for IOS devices</ButtonText>
             </ButtonGlue>
        :       
            <ButtonGlue onPress={takePicture} >
                <ButtonText>Take Picture</ButtonText>
            </ButtonGlue>
        }  
        <ButtonGlue classname='mt-20' onPress={pickImage}>
            <ButtonText>Upload Picture</ButtonText>
        </ButtonGlue>
        <ButtonGlue onPress={navigateToImagePreview}>
            <ButtonText>Next</ButtonText>
        </ButtonGlue>
    </View>
  )
}

export default ImageSourceSelector