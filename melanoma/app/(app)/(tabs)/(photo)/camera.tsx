import { Platform } from 'react-native';
import { View, Text } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { API_URL } from '@env';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';

import { Pressable } from '@/components/ui/pressable';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';

import ModalComponent from '@/components/Modal';
import { router } from 'expo-router';
import { useSession } from '@/services/authContext';

interface IRenderCameraProps {
    x_coordinate: number,
    y_coordinate: number
}

const RenderCamera = ({ x_coordinate, y_coordinate }: IRenderCameraProps) => {
    const { accessToken, userId } = useSession();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState();
    const [uri, setUri] = useState<string | null>();
    const ref = useRef<CameraView>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [zoom, setZoom] = useState(0.8);

    const takePicture = async () => {
        try {
            const photo = await ref.current?.takePictureAsync();
            
            if (!photo) {
                throw new Error("Photo is undefined"); 
            }
            console.log("All image metadata", photo); 
            const convertedUri =  await convertToBase64(photo.uri);
            setUri(convertedUri);
        } catch (error) {
            console.error("Error @ take picture", error);
        }
       
    }

    useEffect(() => {
      console.log('Uri State', uri);  
      console.log('Show modal state', showModal);
    }, [uri]);
    
    const convertToBase64 = async (uri: string): Promise<string> => {
        const response = await fetch(uri);
        const blob = await response.blob();
      
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string); // data:image/jpeg;base64,...
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

    const retakePicture = () => {
        setShowModal(false);
        setUri(null);
    }

    const goToHome = () => {
        setShowModal(false);
        router.navigate('/(app)/(tabs)');
    }

    const processImageReq = async() => {
        try {
            console.log("Request should start");
            console.log("API URL: ", API_URL);
            console.log({ accessToken, userId });
            const result = await fetch(`${API_URL}/v1/metadata/mole`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": accessToken ? `Bearer ${accessToken}` : ''
                },
                body: JSON.stringify({
                    x_coordinate,
                    y_coordinate,
                    moleOwner: userId,
                    photoUri: uri,
                })
            });
            
            console.log({ result });
        } catch (error) {
            
        }
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
        {uri ? (
                <View className='flex-1 w-100'>
                    <Image source={uri} style={{ width: '100%', height: '60%' }} />
                    
                    <View className='w-80 mt-auto self-center'>
                        <ButtonGlue className='w-100 h-14 mb-1' onPress={processImageReq} >
                            <ButtonText>
                                Process the Image
                            </ButtonText>
                        </ButtonGlue>
                        <ButtonGlue className='w-100 h-14 mb-1' onPress={handleCancelRequest}>
                            <ButtonText>
                                Cancel
                            </ButtonText>
                        </ButtonGlue>
                    </View>
                    <ModalComponent 
                        isOpen={showModal} 
                        isAvoidKeyboard={true} 
                        closeOnOverlayClick={true} 
                        bodyContent='Lorem Ipsum Melanoma'
                        onClose={() => setShowModal(false)}
                        primaryButtonText='Retake Picture'
                        secondaryButtonText='Go to Home'
                        primaryButtonAction={retakePicture}
                        secondaryButtonAction={goToHome}
                    />
                </View>
            )    
            : 
            (
                <>
                <CameraView 
                style={{ height: '80%' }}
                facing={facing}
                enableTorch={true}
                autofocus='on'
                zoom={zoom}
                ref={ref}
                >
                    <View>
                        <Entypo name="chevron-left" size={44} color="black" className='mt-2' />
                    </View>
                    <View className='items-center mt-40'>
                        <MaterialIcons name="center-focus-weak" size={244} color="black" />
                    </View>
                </CameraView>
                <View className='flex-1 items-center justify-center bg-custom-dark'>
                    <Pressable onPress={takePicture}>
                        {({ pressed }) => (
                            <View>
                                {pressed ? 
                                    <MaterialIcons name="radio-button-on" size={84} color="black" />
                                    :
                                    <Ionicons name="radio-button-on" size={94} color="black" />
                                }
                        </View>
                        )}
                    </Pressable>
                </View>
                </>
            )
        }
        </>
    )
}

export default RenderCamera