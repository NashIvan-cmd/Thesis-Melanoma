import { View, Text, SafeAreaView , ScrollView, Linking, Alert, StyleSheet, FlatList } from 'react-native'
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
import ModalComponent from '@/components/Modal';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { formatDate } from '@/services/formatDate';
import { useSession } from '@/services/authContext';
import { moleData, molesToDisplay } from '@/api/moleData';
import { useMoleDataStore } from '@/services/moleStore';
import { API_URL } from '@env';

export type Mole = {
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
    const { setSelectedMole } = useMoleDataStore();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [uri, setUri] = useState<string | null>();
    const [molesArray, setMolesArray] = useState([]);
    const ref = useRef<CameraView>(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalV1, setShowModalV1] = useState(false);


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

                setMolesArray(result.fetchedAllMoles);
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

    const navigateToAddSpot = async() => {
        try {
            const checkUserFitzAndAgreement = await fetch(`${API_URL}/v1/check?userId=${userId}`, {
                method: "GET"
            })

            console.log({ checkUserFitzAndAgreement });
            const data = await checkUserFitzAndAgreement.json();

            console.log(data);
            if (!data || !data.record) {
                setShowModal(true);
                return;
            }

            if (!data.agreement) {
                setShowModalV1(true);
                return
            }

            router.push('/(app)/(tabs)/(photo)/addSpot_screen'); // Adjust this based on your tab structure
        } catch (error) {
            console.error("Error @ navigate to add spot", error);
        }
    }

    const navigateToMoleDetails = (index: number) => {
        console.log("Index selected: ", index);
        setSelectedMole(molesArray[index]);
        router.navigate('/screens/moleDetails');
    }

    return (
        <SafeAreaView className="flex-1">
            <View className='flex-1 bg-slate-50 p-[20]'>
                <Text className="text-2xl font-bold text-blue-800 mb-2">Skin Lesion Records</Text>
                <Text className="text-xs text-slate-500 mb-1">Scroll to view all records</Text>
                <View className="flex-1">
                    <FlatList<Mole>
                        data={molesArray}  // Replace with actual data
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={true}
                        indicatorStyle="black"
                        renderItem={({ item, index }) => (
                            <View key={index} className='flex flex-row h-[90] w-full bg-white border border-slate-200 p-[10] mt-[5] rounded-lg shadow-sm'>
                                <View className="h-16 w-16 bg-blue-100 mr-[10] rounded-md overflow-hidden">
                                    <Image source={{ uri: item.body_part }} style={{ width: 64, height: 64, borderRadius: 8 }}/>
                                </View>
                                <View>
                                    <Text>{" "}</Text>
                                </View>
                                <View className='ml-[10]'>
                                    <Text className="text-slate-800 font-medium text-md">{item.body_part}</Text>
                                    <Text className='text-slate-400 text-md'></Text>
                                    <Text className='text-blue-700 text-sm'>{formatDate(item.createdAt)}</Text>
                                </View>
                                <View className='content-end ml-[35] justify-center'>
                                    <ButtonGlue onPress={() => navigateToMoleDetails(index)} className="bg-blue-600 px-3 py-1 rounded-md">
                                        <ButtonText className="text-white font-medium">
                                            View
                                        </ButtonText>
                                    </ButtonGlue>
                                </View>
                            </View>
                        )}
                        style={{ minHeight: '90%', maxHeight: '90%' }}
                        ListFooterComponent={<View className="h-10 border-t border-dashed border-slate-200 mt-2"><Text className="text-center text-xs text-slate-400 mt-2">End of Records</Text></View>}
                    />
                    {/*Some sort of array here*/}
                </View>
                
                <View>
                <ButtonGlue onPress={navigateToAddSpot} size='xl' className='bg-blue-600 mt-[10] rounded-lg shadow-sm'>
                    <ButtonText className='font-extrabold text-lg text-white'>Add new mole spot</ButtonText>
                </ButtonGlue>
                </View>
    
                <ModalComponent
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                titleContent="Missing FitzPatrick Data"
                bodyContent="You need to complete your FitzPatrick profile before adding a spot."
                primaryButtonText="Go to Settings"
                secondaryButtonText="Cancel"
                primaryButtonAction={() => {
                    setShowModal(false);
                    router.push("/(app)/(tabs)/(settings)"); // or your profile route
                    }}
                    secondaryButtonAction={() => setShowModal(false)}
                />
                <ModalComponent
                isOpen={showModalV1}
                onClose={() => setShowModalV1(false)}
                titleContent="User Agreement"
                bodyContent="You need to agree to the App policy and terms"
                primaryButtonText="Go to Settings"
                secondaryButtonText="Cancel"
                primaryButtonAction={() => {
                    setShowModalV1(false);
                    router.push("/(app)/(tabs)/(settings)"); // or your profile route
                    }}
                    secondaryButtonAction={() => setShowModalV1(false)}
                />

            </View>
        </SafeAreaView>
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