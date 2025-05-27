import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useMoleDataStore } from '@/services/moleStore';
import BackButton from '@/components/backButton';
import { MaterialIcons } from '@expo/vector-icons';
import { calculateAdjustedScore } from '@/components/ui/testDisk';
import { Input, InputField } from "@/components/ui/input";
import { API_URL } from '@env';
import { useSession } from '@/services/authContext';

// Define the types based on what's returned from your API
type AssessmentData = {
  model_assessment: string;
  risk_assessment: number;
  risk_summary: string;
};

type MoleData = {
  id: string;
  body_orientation: string;
  body_part: string;
  mole_owner: string;
  x_coordinate: number;
  y_coordinate: number;
  cloudId: string;
  publicId: string;
  createdAt: string;
  overall_assessment: AssessmentData[];
};

const MoleDetails = () => {
  const { userId, accessToken } = useSession();
  const navigation = useNavigation();
  const selectedMole = useMoleDataStore((state) => state.selectedMole);
  const setSelectedMoleToNull = useMoleDataStore((state) => state.setSelectedMoleToNull);
  
  // State for mole data
  const [moleId, setMoleId] = useState('');
  const [bodyPart, setBodyPart] = useState('Identify part');
  const [isEditingBodyPart, setIsEditingBodyPart] = useState(false);
  const [tempBodyPart, setTempBodyPart] = useState("");
  const [moleData, setMoleData] = useState<MoleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  // Fetch mole data from API
  const fetchMoleData = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/v1/fetch/mole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        body: JSON.stringify({ moleId: id })
      });

      const data = await response.json();
      console.log('Fetched mole data:', data);
      
      if (data.moleData) {
        setMoleData(data.moleData);
        setBodyPart(data.moleData.body_part || 'Identify part');
      }
    } catch (error) {
      console.error('Error fetching mole data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMole) {
      setMoleId(selectedMole.id);
      fetchMoleData(selectedMole.id);
    }
    navigation.setOptions({ headerShown: false });
  }, [navigation, selectedMole]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedMoleToNull();
      };
    }, [setSelectedMoleToNull])
  );

  const getRiskColor = (score: number) => {
    if (score < 50) return "#4CAF50"; // Green for low risk
    if (score < 40 && score > 80) return "#FFC107"; // Yellow/amber for medium risk
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

  const handleBodyPartNameChange = async() => {
    try {
      if(!moleId) throw new Error("Missing mole id");

      const result = await fetch(`${API_URL}/v1/name/mole`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken ? `Bearer ${accessToken}` : ''
        },
        body: JSON.stringify({
          moleId,
          bodyPart: tempBodyPart
        })
      });

      const data = await result.json();
      setBodyPart(data.result.body_part);
      setIsEditingBodyPart(false);
      
    } catch (error) {
      console.error("Error @ Body part name change", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingBodyPart(false);
  };

  const toggleReasoning = () => {
    setShowReasoning(!showReasoning);
  };
  
  // Get risk assessment and model assessment from mole data
  const riskScore = moleData?.overall_assessment?.[0]?.risk_assessment || 0;
  const assessment = moleData?.overall_assessment?.[0]?.model_assessment || "No assessment available";
  const riskSummary = moleData?.overall_assessment?.[0]?.risk_summary || "No details available";

  const displayRiskScore = calculateAdjustedScore(riskScore, assessment);
  // Format date for display
  const formattedDate = moleData ? new Date(moleData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "No date available";
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-5">
          <BackButton />
          
          {loading ? (
            <View className="items-center justify-center py-10">
              <Text>Loading mole details...</Text>
            </View>
          ) : (
            <View className="items-center">
              {/* Image placeholder - taking about 25% of screen height */}
              <View className="w-full aspect-square max-h-48 bg-gray-100 rounded-lg items-center justify-center mb-4">
                <Text className="text-gray-500">Mole Image</Text>
              </View>
              
              {/* Disclaimer */}
              <View className="w-full bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4">
                <Text className="text-amber-700 font-bold mb-1">Disclaimer</Text>
                <Text className="text-amber-700">
                  This is a screening tool only. Visiting a medical professional such as a dermatologist is highly recommended for proper diagnosis and treatment.
                </Text>
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
                    onPress={handleBodyPartNameChange}
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
                  backgroundColor: `${getRiskColor(displayRiskScore)}20`,
                  borderWidth: 2,
                  borderColor: getRiskColor(displayRiskScore)
                }}>
                  <Text className="text-xl font-bold" style={{ color: getRiskColor(displayRiskScore) }}>
                    {displayRiskScore.toFixed(1)}
                  </Text>
                </View>
              </View>
              
              {/* Assessment */}
              <View className="w-full bg-gray-50 rounded-lg p-4 mb-4">
                <Text className="font-medium mb-1">Assessment</Text>
                <Text>{assessment}</Text>
              </View>
              
              {/* NLP Reasoning - Conditionally rendered */}
              <View className="w-full mb-4">
                <TouchableOpacity 
                  className="flex-row items-center justify-between bg-gray-100 rounded-lg p-3"
                  onPress={toggleReasoning}
                >
                  <Text className="font-medium">Assessment Details</Text>
                  <MaterialIcons 
                    name={showReasoning ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                    size={24} 
                    color="#374151"
                  />
                </TouchableOpacity>
                
                {showReasoning && (
                  <View className="bg-gray-50 rounded-b-lg p-4 border-t border-gray-200">
                    <Text className="text-gray-700">
                      {riskSummary}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Assessment Date */}
              <View className="w-full bg-gray-50 rounded-lg p-4">
                <Text className="font-medium mb-1">Assessment Date</Text>
                <Text>{formattedDate}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoleDetails;