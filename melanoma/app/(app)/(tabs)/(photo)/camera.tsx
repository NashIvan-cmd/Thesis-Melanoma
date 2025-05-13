import { Platform } from 'react-native';
import { View, Text } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { Image } from 'expo-image';

import { Pressable } from '@/components/ui/pressable';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';

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
    x_coordinate: number,
    y_coordinate: number
}

const RenderCamera = ({ x_coordinate, y_coordinate }: IRenderCameraProps) => {
    const { setImageData } = useImageStore();
    const { accessToken, userId } = useSession();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState();
    const [uri, setUri] = useState<string | null>();
    const ref = useRef<CameraView>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [zoom, setZoom] = useState(0.8);
    const [torchEnabled, setTorchEnabled] = useState(true);
    
    // This hook tells us if the screen is currently focused
    const isFocused = useIsFocused();

    const takePicture = async () => {
        try {
            const photo = await ref.current?.takePictureAsync();
            
            if (!photo) {
                throw new Error("Photo is undefined"); 
            }
            console.log("All image metadata", photo);
            
            const { width, height } = photo;
        const size = Math.min(width, height); // Find the smallest side for a square crop
        const originX = (width - size) / 2;
        const originY = (height - size) / 2;

        // 🛠️ STEP 2: Crop + Resize to 300x300
        const manipulatedImage = await ImageManipulator.manipulateAsync(
            photo.uri,
            [
                { crop: { originX, originY, width: size, height: size } }, // Center crop
                { resize: { width: 300, height: 300 } }                    // Resize to 300x300
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        console.log("Processed image metadata", manipulatedImage);

            // ✅ Set the transformed image URI
            setUri(manipulatedImage.uri);
            
            const base64Image = await convertToBase64(manipulatedImage.uri);
            setImageData(base64Image);

            router.navigate("/(app)/(tabs)/(photo)/imageSourceSelect")
        } catch (error) {
            console.error("Error @ take picture", error);
        }
    }

    const handleGoBack = () => {
        router.navigate("/(app)/(tabs)/(photo)/addSpot_screen");
    }
    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        // Make sure the result is valid and the URI exists
        if (!result.canceled && result.assets && result.assets[0].uri) {
          const uri = result.assets[0].uri;  // Get the URI from the first asset
          setUri(uri);  // Save the URI of the selected image
        } else {
          console.error("Image picker failed or user cancelled.");
        }
    };

    // Initialize camera and handle torch stability
    useEffect(() => {
        let mounted = true;
        
        if (isFocused && ref.current) {
            // Small delay to ensure the camera is fully mounted before enabling torch
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
    
    // Prevent unnecessary re-renders that might cause torch blinking
    const takePictureStable = React.useCallback(async () => {
        await takePicture();
    }, []);
    
    const retakePicture = () => {
        setShowModal(false);
        setUri(null);
    }

    const goToHome = () => {
        setShowModal(false);
        router.navigate('/(app)/(tabs)');
    }

    const navigateToImagePreview = async() => {
        router.navigate("/(app)/(tabs)/(photo)/imagePreview");
    }

    if (!permission) {
        //Camera permissions are still loading.
        return <View />;
    }

    const handleCancelRequest = () => {
        setShowModal(true);
    }

    return(
        <>
                {/* Only render camera when screen is focused */}
                {isFocused ? (
                    <>
                    <CameraView 
                        style={{ height: '88%' }}
                        facing={facing}
                        enableTorch={torchEnabled}
                        autofocus={Platform.OS == "ios" ? 'off' : 'on'}
                        zoom={zoom}
                        ref={ref}
                        >
                        {/* Safe space for back button with padding */}
                        <View className="pt-12 pl-4">
                            <Pressable onPress={handleGoBack}>
                            <Entypo name="chevron-left" size={44} color="white" />
                            </Pressable>
                        </View>
                        
                        {/* Center targeting circle */}
                        <View className="flex-1 items-center justify-center">
                            <View className="items-center">
                            <Entypo name="circle" size={80} color="white" />
                            </View>
                        </View>
                        
                        {/* Guidelines text overlay */}
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

                    {/* Bottom controls with torch toggle and capture button */}
                    <View className="h-24 flex-row items-center justify-center bg-custom-dark">
                        {/* Capture button */}
                        <Pressable onPress={takePictureStable}>
                            {({ pressed }) => (
                            <View>
                                {pressed ? 
                                <MaterialIcons name="radio-button-on" size={74} color="white" />
                                :
                                <Ionicons name="radio-button-on" size={84} color="white" />
                                }
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
    )
}

export default RenderCamera;