import { View, Text, Platform, SafeAreaView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import BackButton from '@/components/backButton';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { useImageStore } from '@/services/imageStore';
import { Image } from 'expo-image';
import { convertToBase64 } from '@/services/imageManipulation';

import { useSession } from '@/services/authContext';
import { moleData } from '@/api/moleData';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

      const manipulatedImage = await ImageManipulator.manipulateAsync(
         uri,
        [{ resize: { width: 300, height: 300 } }],
         { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log(uri);
      const convertedUri = await convertToBase64(manipulatedImage.uri);
      setImageData(convertedUri);
    } else {
      console.error('Image picker failed or user cancelled.');
    }
  };

  const processImageRequest = async() => {
    try {
        if (!accessToken || !userId) {
          throw new Error("Incomplete credentials to make this request");
        }
        const result = await moleData(accessToken, userId);
    } catch (error) {
        console.error("Error @ process image request", error);    
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAwareScrollView 
        className="flex-1"
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="always"
      >
        <View className="p-4">
          <BackButton />
          
          <View
            style={{
                width: '100%',
                height: 300,
                borderWidth: 2,
                marginTop: 20,
                borderStyle: 'dashed',
                borderColor: '#90CDF4', // tailwind blue-300
                borderRadius: 16,
                backgroundColor: '#EBF8FF', // tailwind blue-50
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
            }}
          >
            {uri ? (
                <Image
                  source={uri}
                  style={{ width: '102%', height: 300, borderRadius: 12 }}
                  contentFit="cover"
                />
            ) : (
                <View className="items-center">
                  <Text
                    style={{ color: '#4A5568', fontSize: 16, marginBottom: 8 }}
                  >
                    No image selected
                  </Text>
                  <Text className="text-sm text-slate-500 text-center px-6">
                    Choose one of the options below to add an image
                  </Text>
                </View>
            )}
          </View>

          <View className="gap-3 mb-6">
            {Platform.OS === 'ios' ? (
                <ButtonGlue size='lg' className="bg-teal-600 w-full">
                  <ButtonText>Please upload for iOS devices</ButtonText>
                </ButtonGlue>
            ) : (
                <ButtonGlue size='lg' onPress={takePicture} className="bg-teal-600 w-full">
                  <ButtonText>Take Picture</ButtonText>
                </ButtonGlue>
            )}

            <ButtonGlue size='lg' onPress={pickImage} className="bg-teal-600 w-full">
                <ButtonText>Upload Picture</ButtonText>
            </ButtonGlue>
          </View>

          <View className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-8">
            <Text className="text-blue-800 font-medium mb-1">About Analysis</Text>
            <Text className="text-slate-700 text-sm mb-2">
              By analyzing this image, you are submitting it for automated screening of potential skin concerns.
            </Text>
            <Text className="text-slate-700 text-sm italic">
              <Text className="font-medium">Disclaimer:</Text> This app is for screening purposes only and does not replace evaluation by a professional dermatologist.
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      
      {/* Fixed Action Button at bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <ButtonGlue 
          onPress={processImageRequest} 
          isDisabled={!uri}
          className={`${uri ? 'bg-blue-700' : 'bg-blue-400'} h-14 py-4 rounded-xl shadow-md w-full`}>
            <ButtonText className="text-lg font-medium">Analyze Image</ButtonText>
        </ButtonGlue>
      </View>
    </SafeAreaView>
  );
};

export default ImageSourceSelector;