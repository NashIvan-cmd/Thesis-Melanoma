import { View, Text, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { router, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useFocusEffect } from '@react-navigation/native';

import BackButton from '@/components/backButton';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { useImageStore } from '@/services/imageStore';
import { Image } from 'expo-image';
import { convertToBase64 } from '@/services/imageManipulation';

import { useSession } from '@/services/authContext';
import { moleData } from '@/api/moleData';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAssessmentStore } from '@/services/useAssessmentStore';
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { useRecheckMoleStore } from '@/services/useRecheckStore';

import { I_Assessment } from '@/api/moleData';

const ImageSourceSelector = () => {
  const { accessToken, userId } = useSession();
  const { setImageData } = useImageStore();
  const { uri } = useImageStore.getState();
  const { setAssessmentData } = useAssessmentStore();
  const { resetRecheck } = useRecheckMoleStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState({ visible: false, message: "" });
  const [shouldResetOnBlur, setShouldResetOnBlur] = useState(true);
  const navigation = useNavigation();
  
  // Use a ref to track the current state instead of relying on the state variable directly
  const shouldResetRef = useRef(true);

  // Update the ref whenever the state changes
  useEffect(() => {
    shouldResetRef.current = shouldResetOnBlur;
  }, [shouldResetOnBlur]);

  // Handle screen focus and blur
  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen focused");
      
      // Cleanup function that runs when screen loses focus
      return () => {
        console.log("Screen lost focus");
        if (shouldResetRef.current) {
          console.log("Resetting recheck state");
          resetRecheck();
        } else {
          console.log("Skip resetting recheck state");
          // Reset the flag for next time - update both state and ref
          setShouldResetOnBlur(true);
          shouldResetRef.current = true;
        }
      };
    }, [resetRecheck])
  );

  // Progress bar animation
  React.useEffect(() => {
    let progressInterval: any;
    
    // When analysis starts, animate the progress bar
    if (isAnalyzing) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          // Cap at 90% during analysis to indicate it's still working
          // We'll jump to 100% once the analysis is complete
          if (prevProgress < 90) {
            return prevProgress + 5;
          }
          return prevProgress;
        });
      }, 300);
    } else if (progress > 0) {
      // When analysis completes, finish the progress bar
      setProgress(100);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isAnalyzing]);

  const takePicture = () => {
    // Prevent reset when navigating to camera - update both state and ref
    console.log('Look it should not reset');
    setShouldResetOnBlur(false);
    shouldResetRef.current = false; // Immediately update the ref
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
        // Clear any previous errors
        setError({ visible: false, message: "" });
        
        if (!accessToken || !userId) {
          throw new Error("Incomplete credentials to make this request");
        }

        // Show progress bar while processing
        setIsAnalyzing(true);

        const parsedResult: I_Assessment | undefined = await moleData(accessToken, userId);

        if (!parsedResult) throw new Error("Result is missing!");
        
        console.log("Cloud Id", parsedResult.moleData.cloudId);
        setAssessmentData(
            parsedResult.moleData.cloudId,
            parsedResult.moleData.x_coordinate,
            parsedResult.moleData.y_coordinate,
            parsedResult.assessment.model_assessment,
            parsedResult.assessment.risk_assessment,
            parsedResult.assessment.risk_summary,
            parsedResult.moleData.body_part,
            parsedResult.assessment.createdAt
        );

        // Hide progress bar
        setIsAnalyzing(false);
        
        // Navigate to assessment screen
        router.navigate("/(app)/screens/assessment");
    } catch (error) {
        console.error("Error @ process image request", error);
        setIsAnalyzing(false);
        
        // Set error message for UI
        let errorMessage = "Unable to analyze image. Please try again.";
        
        if (error instanceof Error) {
          if (error.message.includes("credentials")) {
            errorMessage = "Session expired. Please log in again.";
          } else if (error.message.includes("network") || error.message.includes("timeout")) {
            errorMessage = "Network error. Please check your connection and try again.";
          } else if (error.message.includes("Result is missing")) {
            errorMessage = "Server returned invalid data. Please try again later.";
          }
        }
        
        setError({
          visible: true,
          message: errorMessage
        });
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
          
          {/* Error message */}
          {error.visible && (
            <View className="mt-2 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex-row items-center">
              <View className="h-5 w-5 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-white text-xs font-bold">!</Text>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-red-800 font-medium">{error.message}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setError({ visible: false, message: "" })}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Text className="text-red-600 font-bold text-lg">×</Text>
              </TouchableOpacity>
            </View>
          )}
          
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
      
      {/* Progress Overlay */}
      {isAnalyzing && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center">
          <View className="bg-white p-6 rounded-xl w-4/5 items-center">
            <Text className="text-lg font-medium mb-4 text-slate-800">Analyzing Image...</Text>
            <View className="w-full mb-3">
              <Progress value={progress} size="md" className="w-full">
                <ProgressFilledTrack className="bg-blue-600" />
              </Progress>
            </View>
            <Text className="text-sm text-slate-500">
              Please wait while our AI analyzes your image
            </Text>
          </View>
        </View>
      )}
      
      {/* Error Retry Button (appears when there's an error and analysis is not in progress) */}
      {error.visible && !isAnalyzing && (
        <View className="absolute bottom-20 left-0 right-0 px-4">
          <ButtonGlue 
            onPress={() => setError({ visible: false, message: "" })}
            className="bg-red-600 h-12 py-3 rounded-xl shadow-md w-full mb-2">
            <ButtonText className="text-base font-medium">Dismiss Error</ButtonText>
          </ButtonGlue>
        </View>
      )}
      
      {/* Fixed Action Button at bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <ButtonGlue 
          onPress={processImageRequest} 
          isDisabled={!uri || isAnalyzing}
          className={`${!uri || isAnalyzing ? 'bg-blue-400' : error.visible ? 'bg-blue-700' : 'bg-blue-700'} h-14 py-4 rounded-xl shadow-md w-full`}>
            <ButtonText className="text-lg font-medium">
              {isAnalyzing ? 'Analyzing...' : error.visible ? 'Retry Analysis' : 'Analyze Image'}
            </ButtonText>
        </ButtonGlue>
      </View>
    </SafeAreaView>
  );
};

export default ImageSourceSelector;