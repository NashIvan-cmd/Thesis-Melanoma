import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector, PanGestureHandler, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';

import { Image } from 'expo-image';

import { Button as ButtonGlue, ButtonText } from "@/components/ui/button"

const melanoma_logo_2 = require('@/assets/images/melanoma_logo_2.png');
const FrontBody2 = require('@/assets/images/FrontBody-Photoroom.png');
const BackBody2 = require('@/assets/images/BackBody-Photoroom.png');

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

import RenderCamera from '@/app/(tabs)/photo/camera'

const { width, height } = Dimensions.get('window');

// I will just changed you
type TouchPosition = {
  x: number;
  y: number;
  percentX: number;
  percentY: number;
}

type Coordinates = {
  x: number;
  y: number;
  percentX: number;
  percentY: number;
  absoluteX: number;
  absoluteY: number;
}

type Normalized = {
  normalizedX: number;
  normalizedY: number;
}

// I need a pointer on the screen. 
// After that I need to limit the pointer within the body.
const AddSpot_screen = () => {
const ASPECT_RATIO = 620 / 255; // original height / original width
const RESPONSIVE_WIDTH = width * 0.7; // Using 70% of screen width
const RESPONSIVE_HEIGHT = RESPONSIVE_WIDTH * ASPECT_RATIO;
  const [showCamera, setShowCamera] = useState(false);
  const [bodyPosition, setBodyPosition] = useState<'Front Body' | 'Back Body'>('Front Body');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [touchPosition, setTouchPosition] = useState<TouchPosition>({ 
    x: RESPONSIVE_WIDTH / 2, 
    y: RESPONSIVE_HEIGHT / 2,
    percentX: 50,
    percentY: 50
  });
  const [coordinates, setCoordinates] = useState<Coordinates>({ 
    x: 0 , 
    y: 0, 
    percentX: 0, 
    percentY: 0, 
    absoluteX: 0, 
    absoluteY: 0 
  });
  const [normalizedCoordinates, setNormalizedCoordinates] = useState<Normalized>({
    normalizedX: 0,
    normalizedY: 0
  });
  const imageRef = useRef(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  // Translation (Move)
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const savedTranslationX = useSharedValue(0);
  const savedTranslationY = useSharedValue(0);

  // Focal Point for Zooming
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  /** 📌 Pinch Gesture - Handles Zoom */
  const pinchGesture = Gesture.Pinch()
      .onUpdate((event) => {
      const MIN_SCALE = 1;
      const MAX_SCALE = 2.5;

      scale.value = Math.min(Math.max(savedScale.value * event.scale, MIN_SCALE), MAX_SCALE);

      // Calculate Zoom Center
      focalX.value = event.focalX;
      focalY.value = event.focalY;
      })
      .onEnd(() => {
      savedScale.value = scale.value;
      });
    
  useEffect(() => {
  console.log('Scale value', scale.value);
  }, [scale.value]);
  
  /** 📌 Pan Gesture - Moves Image when Zoomed */
  const panGesture = Gesture.Pan()
  .onUpdate((event) => {
      if (scale.value > 1) { // Only allow movement when zoomed in
      const maxTranslateX = (scale.value - 1) * (255 / 2); // Adjust for width
      const maxTranslateY = (scale.value - 1) * (620 / 2); // Adjust for height

      translationX.value = Math.min(
          maxTranslateX,
          Math.max(-maxTranslateX, savedTranslationX.value + event.translationX)
      );
      
      translationY.value = Math.min(
          maxTranslateY,
          Math.max(-maxTranslateY, savedTranslationY.value + event.translationY)
      );
      }
  })
  .onEnd(() => {
      savedTranslationX.value = translationX.value;
      savedTranslationY.value = translationY.value;
  });

  /** 📌 Double Tap Gesture - Handles zoom reset to 1*/
  const doubleTapGesture = Gesture.Tap()
  .numberOfTaps(2)
  .onEnd(() => {
    scale.value = withSpring(1);
    savedScale.value = 1;
  });

  /** 🎨 Animated Style */
  const animatedStyle = useAnimatedStyle(() => ({
      transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
      ],
  }));

  const onPanGestureV2 = (event: { nativeEvent: PanGestureHandlerEventPayload }) => {
    const { absoluteX, absoluteY } = event.nativeEvent;
  
    // Normalize based on screen size
    const normalizedX = absoluteX / width;
    const normalizedY = absoluteY / height;
  
    // Convert to image space (assuming the image scales to fit)
    const adjustedX = normalizedX * imageSize.width;
    const adjustedY = normalizedY * imageSize.height;
  
    // Ensure coordinates stay inside image bounds
    const clampedX = Math.max(0, Math.min(adjustedX, imageSize.width));
    const clampedY = Math.max(0, Math.min(adjustedY, imageSize.height));
  
    // Convert to percentage relative to image
    const percentX = (clampedX / imageSize.width) * 100;
    const percentY = (clampedY / imageSize.height) * 100;
  
    setTouchPosition({ x: clampedX, y: clampedY, percentX, percentY });
    setCoordinates({
      x: clampedX,
      y: clampedY,
      percentX,
      percentY,
      absoluteX,
      absoluteY
    });
    setNormalizedCoordinates({normalizedX: absoluteX, normalizedY: clampedY});
  };
  

  // console.log({ touchPosition });
  console.log({ coordinates });
  console.log({ imagePosition });
  console.log('image ref', imageRef);
  
  const toggleBodyPostion = (): void => {
  if (bodyPosition === 'Front Body') {
      setBodyPosition('Back Body');
  } else {
      setBodyPosition('Front Body');
  }
  }

  const handleShowCameraRequest = () => {
    setShowCamera(true);
  }

  return (
    <>
      {showCamera ? (
        <RenderCamera />
      ) : ( 
        <View className='flex-1 p-2 pr-5 pl-5 items-center'>
          <Text>0 spots</Text>
          <View style={styles.coordinatesDisplay}>
            <Text style={styles.coordinatesText}>Relative: x={coordinates.x.toFixed(0)}, y={coordinates.y.toFixed(0)}</Text>
            <Text style={styles.coordinatesText}>Absolute: x={coordinates.absoluteX.toFixed(0)}, y={coordinates.absoluteY.toFixed(0)}</Text>
            <Text style={styles.coordinatesText}>Normalized: x={normalizedCoordinates.normalizedX.toFixed(0)}, y={normalizedCoordinates.normalizedY.toFixed(0)}</Text>
          </View>
        <Animated.View style={animatedStyle} className='flex-1 w-100 bg-fff items-center'>
          <View className='items-center'>
            <PanGestureHandler onGestureEvent={onPanGestureV2}>
              <View >
              <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
                <Image 
                    ref={imageRef}
                    source={
                        bodyPosition === "Front Body" ? 
                        FrontBody2 : BackBody2
                    }
                    onLayout={(event) => {
                      const { width, height } = event.nativeEvent.layout;
                      setImageSize({ width, height });
                    }}
                    style={[
                        { width: 225, height: 545 }
                    ]}/>
            </GestureDetector>
            <View style={[
                styles.indicator,
                { 
                  left: `${coordinates.percentX}%`, 
                  top: `${coordinates.percentY}%`,
                  transform: [
                    { translateX: -5 },  // Half the width of your indicator
                    { translateY: -5 }   // Half the height of your indicator
                  ]
                }
              ]}>
                <Entypo name="pin" size={24} color="red" />
              </View>
              </View>
            </PanGestureHandler>
            </View>
          </Animated.View>
          <View className='mb-1 items-center'>
            <ButtonGlue className="bg-orange-500 rounded-lg" onPress={toggleBodyPostion}>
                <ButtonText>{bodyPosition}</ButtonText>
            </ButtonGlue>
          </View>
          <View className='w-full mt-auto mb-1 rounder-lg'>
            <ButtonGlue onPress={handleShowCameraRequest}>
              <ButtonText>
                Add Spot
              </ButtonText>
          </ButtonGlue>
          </View>
          <View className="w-full bg-slate-600/80 mt-auto items-center rounded-lg p-[4]">
            <Text>Drag the pin to indicate mole spot</Text>
            <Text>
                <MaterialCommunityIcons name="gesture-pinch" size={24} color="black" />
                Pinch to zoom
            </Text>
          </View>
        </View>
     )
    }
    </>
  )
}

export default AddSpot_screen

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 100,
  },
  gestureArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  indicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coordinatesDisplay: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  coordinatesText: {
    color: 'black',
    fontSize: 16,
  },
});
