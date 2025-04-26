import { View, Text, ScrollView, Linking, Alert, StyleSheet, FlatList } from 'react-native'
import { useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
//import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React, { useState, useCallback, useRef, useEffect } from 'react'
//import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
//import * as Device from 'expo-device';

// const FrontBody = require('@/assets/images/FrontBody.jpg');
// const BackBody = require('@/assets/images/BackBody.jpg');

import { Button as ButtonGlue, ButtonText } from "@/components/ui/button"
import { Pressable } from '@/components/ui/pressable';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useSession } from '@/services/authContext';
import { molesToDisplay } from '@/api/moleData';

type Mole = {
    id: string;
    body_orientation: string;
    body_part: string;
    mole_owner: string;
    x_coordinate: number;
    y_coordinate: number;
    cloudId: string;
    publicId: string;
    createdAt: string;
    signedUrl: string;
  };

const Photo = () => {
    const { userId, accessToken } = useSession();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [uri, setUri] = useState<string | null>();
    const [molesArray, setMolesArray] = useState([]);
    const ref = useRef<CameraView>(null);

    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            console.log("Use effect running");
            const runAsyncEffect = async() => {
                try {
                if (!userId) throw new Error("Missing userId");
                if (!accessToken) throw new Error("Missing access token");
                
                const response = await molesToDisplay(userId, accessToken);
                
                const result = await response?.json();
                
                console.log({ result });
                if(!result) throw new Error("No response from molesToDisplay");

                setMolesArray(result.manipulatedMoles);
                } catch (error) {
                console.error("Error @ run async effect", error);
                }    
            }

            runAsyncEffect();
            console.log('Moles array', molesArray);
        }, [userId])
    );

    

    const handleOpenSettings = () => {
        Linking.openSettings().catch(() => {
          Alert.alert("Error", "Unable to open settings");
        });
    };

    const takePicture = async () => {
        const photo = await ref.current?.takePictureAsync();
        setUri(photo?.uri);
        // console.log('Photo Uri', photo?.uri);
    }
        // console.log('Uri State', uri);

    // if (!permission) {
    //     // Camera permissions are still loading.
    //     return <View />;
    // }

    // if (!permission.granted) {
    //     return (
    //         <View>
    //             <ButtonGlue onPress={handleOpenSettings}>
    //                 <ButtonText>Open Settings</ButtonText>
    //             </ButtonGlue>
    //         </View>
    //     )
    // }

    const renderPhoto = () => {
        return(
            <View className='flex-1'>
            <Image source={{ uri }}  
            contentFit="contain"
            style={{ width: 300, aspectRatio: 1 }}
            />
            </View> 
        )
    }

    const renderCamera = () => {
        return(
            <CameraView 
                style={{ height: 600 }}
                facing={facing}
                enableTorch={true}
                autofocus='on'
                ref={ref}
            >
                <View>
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
            </CameraView>
        )
    }

    const navigateToAddSpot = () => {
        router.push('/(app)/(tabs)/(photo)/addSpot_screen'); // Adjust this based on your tab structure
    }

    const navigateToMoleDetails = () => {
        router.navigate('/screens/moleDetails');
    }

    return (
        <View className='flex-1 bg-custom-dark p-[20]'>
            <Text>Of the Goodness of God</Text>
            <View>
                <FlatList<Mole>
                    data={molesArray}  // Replace with actual data
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <View key={index} className='flex flex-row h-[90] w-full bg-slate-600/80 p-[10] mt-[5] rounded'>
                            <View className="min-h-[40px] min-w-[40px] bg-orange-500 mr-[10] rounded">
                                <Image source={{ uri: item.cloudId }}  style={{ width: 40, height: 70, borderRadius: 8 }}/>
                            </View>
                            <View>
                                <Text>{" "}</Text>
                            </View>
                            <View className='ml-[10]'>
                                <Text className="text-slate-400 text-md">{item.body_part}</Text>
                                <Text className='text-slate-400 text-md'></Text>
                                <Text className='text-slate-400 text-md'>{item.createdAt}</Text>
                            </View>
                            <View className='content-end ml-[35] justify-center'>
                                <ButtonGlue onPress={navigateToMoleDetails}>
                                    <ButtonText>
                                        View
                                    </ButtonText>
                                </ButtonGlue>
                            </View>
                        </View>
                    )}
                    style={{ minHeight: '90%', maxHeight: '90%' }}
                />
                {/*Some sort of array here*/}
            </View>
            
            <View>
            <ButtonGlue onPress={navigateToAddSpot} size='xl' className='bg-orange-500 mt-[10]'>
                <ButtonText className='font-extrabold text-lg'>Add new spot</ButtonText>
            </ButtonGlue>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shutterBtn: {
        backgroundColor: "transparent",
        borderWidth: 5,
        borderColor: "white",
        width: 85,
        height: 85,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
      },
})

export default Photo