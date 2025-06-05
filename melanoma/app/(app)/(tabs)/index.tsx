import { View, StyleSheet, Text, SafeAreaView, ScrollView } from "react-native";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import { router, useFocusEffect } from "expo-router";

import * as ImagePicker from 'expo-image-picker';

import { Button as ButtonGlue, ButtonText } from "@/components/ui/button"

import { API_URL } from "@env";

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSession } from "@/services/authContext";

export default function Index() {
  const { userId, username } = useSession();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [fitzpatrickCompleted, setFitzpatrickCompleted] = useState(false);
  
  const navigateToSettings = () => {
    router.navigate("/(app)/(tabs)/(settings)")
  }

  const navigateToScan = () => {
    // You'll handle this logic
    router.push("/(app)/(tabs)/(photo)");
    console.log("Navigate to scan");
  }

  useFocusEffect(
    useCallback(() => {
      const checkUserData = async () => {
        try {
          const checkUserFitzAndAgreement = await fetch(
            `${API_URL}/v1/check?userId=${userId}`,
            {
              method: 'GET',
            }
          );
  
          console.log({ checkUserFitzAndAgreement });
          const data = await checkUserFitzAndAgreement.json();

          console.log({ data });
  
          console.log(data);
          if (data.record) {
            setFitzpatrickCompleted(true);
          } else {
            setFitzpatrickCompleted(false);
          }
  
          if (data.agreement.policyAgreement === true) {
            setPolicyAgreed(true);
          } else {
            setPolicyAgreed(false);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
  
      checkUserData();
    }, [userId])
  );
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>

      <View style={styles.container}>
        <View className="pt-[15] pb-[5]">
          <Text className="text-custom-xlg font-extrabold text-blue-800">Track Your Skin Health</Text>
        </View>
        <View>
          <Text style={{ color: '#516375'}} className="text-[12px] font-semibold">Take regular photos to monitor changes in your skin</Text>
        </View>
        <View className="w-full bg-white border border-slate-200 rounded-xl mt-3 mb-1 p-4 shadow-sm">
          <Text className="mb-[2]">
            <Text className="text-slate-600 text-md">Welcome!</Text>
          </Text>
          <Text>
            <Text className="text-blue-800 font-extrabold text-lg mb-1">{username?.toLocaleUpperCase()}</Text>
          </Text>
          {/* <Text>
            <Text className="text-slate-600 text-md">Your last check-up was X days ago</Text>
          </Text>
          <Text>
            <Text className="text-blue-600 text-md font-medium">Result: <Text className="text-green-600">Benign</Text> | <Text className="text-red-600">Malignant</Text></Text>
          </Text> */}
        </View>

        <View className="flex flex-row w-full mt-2 mb-2 gap-4">
          <View className="flex-1 max-w-180 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <FontAwesome5 
              name="sun" 
              size={24} 
              color="#1E88E5"  // Medical blue color
              className="mb-2"
              />
            <Text className="text-slate-800 font-semibold text-lg mb-1">
              Check Monthly
            </Text>
            <Text className="text-slate-600 text-sm">
              Regular monitoring helps early detection
            </Text>
          </View>

          <View className="flex-1 max-w-180 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <FontAwesome6 
              name="clock" 
              size={24} 
              color="#1E88E5"  // Consistent medical blue
              className="mb-2"
              />
            <Text className="text-slate-800 font-semibold text-lg mb-1">
              Track Changes
            </Text>
            <Text className="text-slate-600 text-sm">
              Watch for the evolution of marks
            </Text>
          </View>
        </View>

        <View className="w-full bg-white border border-slate-200 rounded-xl mt-2 mb-2 p-4 shadow-sm">
          <Text className="text-blue-800 font-extrabold text-lg mb-3">Prerequisites</Text>
          
          <View className="flex-row items-center mb-3">
            {policyAgreed ? (
              <MaterialIcons name="check-circle" size={24} color="#10b981" />
            ) : (
              <MaterialIcons name="cancel" size={24} color="#ef4444" />
            )}
            <Text className="ml-2 text-slate-700">
              App Policy Agreement
              {!policyAgreed && (
                <Text 
                className="text-blue-600 ml-2"
                onPress={() => navigateToSettings()}
                >
                 {(' ')}Settings
                </Text>
              )}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            {fitzpatrickCompleted ? (
              <MaterialIcons name="check-circle" size={24} color="#10b981" />
            ) : (
              <MaterialIcons name="cancel" size={24} color="#ef4444" />
            )}
            <Text className="ml-2 text-slate-700">
              Fitzpatrick Skin Type
              {!fitzpatrickCompleted && (
                <Text 
                className="text-blue-600 ml-2"
                onPress={() => navigateToSettings()}
                >
                 {(' ')} Settings
                </Text>
              )}
            </Text>
          </View>
        </View>

        <View className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 mt-2 mb-2 shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="scan" size={24} color="#1E88E5" />
            <Text className="text-blue-800 font-semibold text-lg">How to Scan Your Mole</Text>
          </View>

          <View className="space-y-3">
            <Text className="text-slate-800">
              <Text className="font-semibold">Step 1: </Text>
              <Text className="text-slate-600">Navigate to the bottom navigation bar</Text>
            </Text>

            <Text className="text-slate-800">
              <Text className="font-semibold">Step 2: </Text>
              <Text className="text-slate-600">Click the "Scan" tab with the </Text>
              <Ionicons name="scan-outline" size={16} color="#64748b" />
              <Text className="text-slate-600"> icon</Text>
            </Text>

            <Text className="text-slate-800">
              <Text className="font-semibold">Step 3: </Text>
              <Text className="text-slate-600">Position your camera over the mole for analysis</Text>
            </Text>
          </View>

          <View className="mt-4">
            <ButtonGlue 
              onPress={navigateToScan}
              className="bg-blue-600 w-full"
            >
              <ButtonText className="text-white font-semibold">Go to Scan</ButtonText>
            </ButtonGlue>
          </View>
        </View> 

      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',  // Light, clean medical background
    alignItems: 'center',
    padding: 20,
    paddingTop: 10
  },
  imageContainer: {
    flex: 1,
    paddingTop: 28,
  },
  footerContainer: {
    flex: 1,
    alignItems: 'center',
  },
});