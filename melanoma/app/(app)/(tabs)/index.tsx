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
import { useSession } from "@/services/authContext";

export default function Index() {
  const { userId, username } = useSession();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [fitzpatrickCompleted, setFitzpatrickCompleted] = useState(false);
  
  const navigateToSettings = () => {
    router.navigate("/(app)/(tabs)/(settings)")
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
  
          console.log(data);
          if (data || data.record) {
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
        <View className="w-full bg-white border border-slate-200 rounded-xl mt-[30] mb-[1] p-4 shadow-sm">
          <Text className="mb-[10]">
            <Text className="text-slate-600 text-md">Welcome!</Text>
          </Text>
          <Text>
            <Text className="text-blue-800 font-extrabold text-lg mb-1">{username}</Text>
          </Text>
          {/* <Text>
            <Text className="text-slate-600 text-md">Your last check-up was X days ago</Text>
          </Text>
          <Text>
            <Text className="text-blue-600 text-md font-medium">Result: <Text className="text-green-600">Benign</Text> | <Text className="text-red-600">Malignant</Text></Text>
          </Text> */}
        </View>
      <View className="flex flex-row w-full mt-2 mb-4 gap-4">
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
            Documents the evolution of marks
          </Text>
        </View>
      </View>

      <View className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6 shadow-sm">
        <View className="flex-row items-center gap-2 mb-3">
          <Feather name="shield" size={24} color="#1E88E5" />
          <Text className="text-blue-800 font-semibold text-lg">ABCDE Guidelines</Text>
        </View>

        <View className="space-y-2">
          <Text className="text-slate-800 flex-row items-center">
            • <Text className="font-semibold">Asymmetry: </Text>
            <Text className="text-slate-600">Two halves don't match</Text>
          </Text>

          <Text className="text-slate-800 flex-row items-center">
            • <Text className="font-semibold">Border: </Text>
            <Text className="text-slate-600">Irregular or jagged edges</Text>
          </Text>

          <Text className="text-slate-800 flex-row items-center">
            • <Text className="font-semibold">Color: </Text>
            <Text className="text-slate-600">Multiple colors or changes</Text>
          </Text>

          <Text className="text-slate-800 flex-row items-center">
            • <Text className="font-semibold">Diameter: </Text>
            <Text className="text-slate-600">Larger than 6mm</Text>
          </Text>

          <Text className="text-slate-800 flex-row items-center">
            • <Text className="font-semibold">Evolution: </Text>
            <Text className="text-slate-600">Changes over time</Text>
          </Text>
        </View> 
      </View> 

      <View className="w-full bg-white border border-slate-200 rounded-xl mt-4 mb-4 p-4 shadow-sm">
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
            className="text-blue-600 ml-2 underline"
            onPress={() => navigateToSettings()}
            >
             {(' ')} Settings
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
            onPress={() => console.log("Navigate to fitzpatrick screen")}
            >
              Complete
            </Text>
          )}
        </Text>
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