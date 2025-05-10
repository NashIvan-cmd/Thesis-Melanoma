import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useMoleDataStore } from '@/services/moleStore';
import BackButton from '@/components/backButton';
import { MaterialIcons } from '@expo/vector-icons';
import { Input, InputField } from "@/components/ui/input";

const MoleDetails = () => {
  const navigation = useNavigation();
  const selectedMole = useMoleDataStore((state) => state.selectedMole);
  const setSelectedMoleToNull = useMoleDataStore((state) => state.setSelectedMoleToNull);
  
  // Keep track of body part editing state
  const [bodyPart, setBodyPart] = useState(selectedMole?.body_part || "Identify part");
  const [isEditingBodyPart, setIsEditingBodyPart] = useState(false);
  const [tempBodyPart, setTempBodyPart] = useState("");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedMoleToNull();
      };
    }, [setSelectedMoleToNull])
  );

  const getRiskColor = (score: number) => {
    if (score < 2) return "#4CAF50"; // Green for low risk
    if (score < 4) return "#FFC107"; // Yellow/amber for medium risk
    return "#F44336"; // Red for high risk
  };

  const handleBodyPartEdit = () => {
    if (!isEditingBodyPart) {
      setTempBodyPart(bodyPart);
      setIsEditingBodyPart(true);
    } else {
      // Save the new body part
      if (tempBodyPart.trim() !== "") {
        setBodyPart(tempBodyPart);
      }
      setIsEditingBodyPart(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingBodyPart(false);
  };

  // Dummy risk score for demonstration
  const riskScore = 2.1;
  
  console.log({ selectedMole });
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-5">
          <BackButton />
          
          <View className="items-center">
            {/* Image placeholder - taking about 25% of screen height */}
            <View className="w-full aspect-square max-h-48 bg-gray-100 rounded-lg items-center justify-center mb-4">
              <Text className="text-gray-500">Big Image</Text>
            </View>
            
            <Text className="text-xl font-bold mb-4">Your Skin Health Timeline</Text>
            
            {/* Body Part - Conditionally rendered based on edit state */}
            {isEditingBodyPart ? (
              <View className="w-full flex-row items-center mb-4">
                <Input 
                  variant="outline" 
                  size="md" 
                  className="flex-1 mr-2"
                >
                  <InputField
                    placeholder="Enter body part..."
                    value={tempBodyPart}
                    onChangeText={setTempBodyPart}
                    autoFocus
                  />
                </Input>
                <TouchableOpacity 
                  className="bg-blue-500 rounded-lg p-2 mr-2"
                  onPress={handleBodyPartEdit}
                >
                  <MaterialIcons name="check" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-gray-300 rounded-lg p-2"
                  onPress={handleCancelEdit}
                >
                  <MaterialIcons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                className="flex-row items-center bg-gray-50 rounded-lg p-3 mb-4 w-full justify-between"
                onPress={handleBodyPartEdit}
              >
                <Text className="text-gray-800 font-medium">
                  {bodyPart === "Identify part" ? "Please identify body part" : bodyPart}
                </Text>
                <MaterialIcons name="edit" size={18} color="#3B82F6" />
              </TouchableOpacity>
            )}
            
            {/* Risk Assessment Score */}
            <View className="mb-4 items-center">
              <Text className="text-base font-medium mb-2">Risk Assessment Score</Text>
              <View className="w-20 h-20 rounded-full items-center justify-center" style={{
                backgroundColor: `${getRiskColor(riskScore)}20`,
                borderWidth: 2,
                borderColor: getRiskColor(riskScore)
              }}>
                <Text className="text-xl font-bold" style={{ color: getRiskColor(riskScore) }}>
                  {riskScore}
                </Text>
              </View>
            </View>
            
            {/* Assessment */}
            <View className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <Text className="font-medium mb-1">Assessment</Text>
              <Text>{"Likely benign"}</Text>
            </View>
            
            {/* NLP Reasoning */}
            <View className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <Text className="font-medium mb-1">Assessment Details</Text>
              <Text className="text-gray-700">
                A long NLP reasoning of the Risk Assessment Score would appear here. This would
                include details about color, border, symmetry, and other factors that contribute
                to the overall risk assessment.
              </Text>
            </View>
            
            {/* Assessment Date */}
            <View className="w-full bg-gray-50 rounded-lg p-4">
              <Text className="font-medium mb-1">Assessment Date</Text>
              <Text>{"May 10, 2025"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoleDetails;