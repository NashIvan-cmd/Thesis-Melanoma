import { View, Text } from 'react-native';
import React, { useRef } from 'react';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';

import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { router } from 'expo-router';

const Instructions = () => {
  const videoRef = useRef<Video>(null);

  const navigateNext = () => {
    router.navigate("/(app)/(tabs)/(photo)/imageSourceSelect")
  }

  useFocusEffect(
    React.useCallback(() => {
      // When screen comes into focus, play the video
      if (videoRef.current) {
        videoRef.current.playAsync();
      }

      // When screen loses focus, pause the video
      return () => {
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      };
    }, [])
  );

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        How to take an accurate photo:
      </Text>
      
      <Video
        ref={videoRef}
        source={require('../../../../assets/videos/pictureGuidelines.mp4')}
        style={{ 
          width: '100%', 
          height: 250,
          marginBottom: 16,
          borderRadius: 8
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={true}
        isLooping={true}
      />

    <Card className='mb-2'>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        1. Go to a place with a good lighting or use flashlight if needed
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        2. Avoid shadow or bad lighting in your mole photo
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>
        3. Zoom in and center the mole then Take the photo. Make sure there is no other background except from the skin around the mole
      </Text>
    </Card>

      <ButtonGlue onPress={navigateNext} className='mt-auto bg-blue-600 h-10'>
        <ButtonText>Next</ButtonText>
      </ButtonGlue>
    </View>
  );
};

export default Instructions;