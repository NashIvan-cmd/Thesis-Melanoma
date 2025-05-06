import { View, Text, Platform } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import BackButton from '@/components/backButton';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { useImageStore } from '@/services/imageStore';
import { Image } from 'expo-image';
import { convertToBase64 } from '@/services/imageManipulation';

import { useSession } from '@/services/authContext';
import { moleData } from '@/api/moleData';

const ImageSourceSelector = () => {
  const { accessToken, userId } = useSession();
  const { setImageData } = useImageStore();
  const { uri } = useImageStore.getState();

  const takePicture = () => {
    router.navigate('/(app)/(tabs)/(photo)/camera');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      console.log(uri);
      const convertedUri = await convertToBase64(uri);
      setImageData(convertedUri);
    } else {
      console.error('Image picker failed or user cancelled.');
    }
  };

  const navigateToImagePreview = () => {
    router.navigate('/(app)/(tabs)/(photo)/imagePreview');
  };

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
    <View className="flex-1 p-4">
      <BackButton />

      <View
        style={{
            width: '100%',
            marginTop: 70,
            height: 320,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: '#D1D5DB', // tailwind gray-300
            borderRadius: 16,
            backgroundColor: '#F9FAFB', // tailwind gray-50
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
        }}
        >
        {uri ? (
            <Image
            source={uri}
            style={{ width: '102%', height: 340, borderRadius: 12 }}
            contentFit="cover"
            />
        ) : (
            <Text
            style={{ color: '#6B7280', fontSize: 16 }} // tailwind text-gray-500 text-base
            >
            No image selected
            </Text>
        )}
        </View>

        <View className="gap-3">
        {Platform.OS === 'ios' ? (
            <ButtonGlue size='lg'>
            <ButtonText>Please upload for iOS devices</ButtonText>
            </ButtonGlue>
        ) : (
            <ButtonGlue size='lg' onPress={takePicture}>
            <ButtonText>Take Picture</ButtonText>
            </ButtonGlue>
        )}

        <ButtonGlue size='lg' onPress={pickImage}>
            <ButtonText>Upload Picture</ButtonText>
        </ButtonGlue>
        </View>

        <View className="mt-10">
        <ButtonGlue onPress={processImageRequest} isDisabled={!uri}>
            <ButtonText>Process Image</ButtonText>
        </ButtonGlue>
        </View>

    </View>
  );
};

export default ImageSourceSelector;
