import { Platform, View, Text, Alert, Linking } from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { Image } from 'expo-image';
import { Pressable } from '@/components/ui/pressable';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import BackButton from '@/components/backButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useIsFocused } from '@react-navigation/native';
import ModalComponent from '@/components/Modal';
import { router } from 'expo-router';
import { useSession } from '@/services/authContext';
import { useImageStore } from '@/services/imageStore';
import { convertToBase64 } from '@/services/imageManipulation';

interface IRenderCameraProps {
  x_coordinate: number;
  y_coordinate: number;
}

const RenderCamera = ({ x_coordinate, y_coordinate }: IRenderCameraProps) => {
  const { setImageData } = useImageStore();
  const { accessToken, userId } = useSession();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [uri, setUri] = useState<string | null>();
  const ref = useRef<CameraView>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [zoom, setZoom] = useState(0.8);
  const [torchEnabled, setTorchEnabled] = useState(true);
  const isFocused = useIsFocused();

  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync();
      if (!photo) throw new Error("Photo is undefined");

      const { width, height } = photo;
      const size = Math.min(width, height);
      const originX = (width - size) / 2;
      const originY = (height - size) / 2;

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          { crop: { originX, originY, width: size, height: size } },
          { resize: { width: 300, height: 300 } }
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      setUri(manipulatedImage.uri);
      const base64Image = await convertToBase64(manipulatedImage.uri);
      setImageData(base64Image);
      router.navigate("/(app)/(tabs)/(photo)/imageSourceSelect");
    } catch (error) {
      console.error("Error @ take picture", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setUri(result.assets[0].uri);
    } else {
      console.error("Image picker failed or user cancelled.");
    }
  };

  useEffect(() => {
    let mounted = true;

    if (isFocused && ref.current) {
      const initTimer = setTimeout(() => {
        if (mounted) {
          setTorchEnabled(true);
        }
      }, 300);

      return () => {
        mounted = false;
        clearTimeout(initTimer);
        console.log('Camera component unmounting');
      };
    }
  }, [isFocused]);

  const takePictureStable = useCallback(async () => {
    await takePicture();
  }, []);

  const retakePicture = () => {
    setShowModal(false);
    setUri(null);
  };

  const goToHome = () => {
    setShowModal(false);
    router.navigate('/(app)/(tabs)');
  };

  useEffect(() => {
    if (permission && !permission.granted) {
      Alert.alert(
        'Camera Permission Needed',
        'Please go to Settings and enable camera access for this app.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-custom-dark">
        <Text className="text-white text-lg text-center mx-4">
          Camera access is required. Please enable it from Settings.
        </Text>
      </View>
    );
  }

  return (
    <>
      {isFocused ? (
        <>
          <CameraView
            style={{ height: '88%' }}
            facing={facing}
            enableTorch={torchEnabled}
            autofocus={Platform.OS === "ios" ? 'off' : 'on'}
            zoom={zoom}
            ref={ref}
          >
            <View className="pt-12 pl-4">
              <BackButton />
            </View>
            <View className="flex-1 items-center justify-center">
              <View className="items-center">
                <Entypo name="circle" size={80} color="white" />
              </View>
            </View>
            <View className="bg-black bg-opacity-50 w-full px-4 py-3 mb-4">
              <Text className="text-white text-center text-lg font-semibold">
                Position Guidelines:
              </Text>
              <Text className="text-white text-center">
                • Hold camera 10-20cm from skin
              </Text>
              <Text className="text-white text-center">
                • Center the mole inside the circle
              </Text>
              <Text className="text-white text-center">
                • Ensure good lighting for clear image
              </Text>
            </View>
          </CameraView>

          <View className="h-24 flex-row items-center justify-center bg-custom-dark">
            <Pressable onPress={takePictureStable}>
              {({ pressed }) => (
                <View>
                  {pressed ? (
                    <MaterialIcons name="radio-button-on" size={74} color="white" />
                  ) : (
                    <Ionicons name="radio-button-on" size={84} color="white" />
                  )}
                </View>
              )}
            </Pressable>
          </View>
        </>
      ) : (
        <View className="flex-1 items-center justify-center bg-custom-dark">
          <Text className="text-white text-lg">Loading camera...</Text>
        </View>
      )}
    </>
  );
};

export default RenderCamera;
