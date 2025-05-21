import { View, Text, ScrollView, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BackButton from '@/components/backButton';

const FitzPatrick = () => {
  const scrollViewRef = useRef(null);
  const { height } = Dimensions.get('window');
  
  // Flash scroll indicator on component mount
  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     setTimeout(() => {
  //       scrollViewRef.current?.flashScrollIndicators();
  //     }, 500);
  //   }
  // }, []);

  const handleNavigate = () => {
    router.navigate('/(app)/(tabs)/(settings)/fitzpatrick/questions');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button and Take Test button */}
     <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity 
          className="p-2 bg-gray-100 rounded-full"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Fitzpatrick Scale</Text>
        <ButtonGlue 
          className="bg-blue-500 py-2 px-4 rounded-full"
          onPress={handleNavigate}
        >
          <ButtonText className="text-white font-semibold">Take Test</ButtonText>
        </ButtonGlue>
      </View>
      
      {/* Scroll indicator */}
      <View className="items-center py-2 bg-white">
        <Ionicons name="chevron-down" size={20} color="#CBD5E0" />
        <Text className="text-xs text-gray-400">Scroll for more</Text>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
      >
        <View className="p-6">
          <Text className="text-2xl font-bold mb-4">
            What is the Fitzpatrick Skin Type Scale?
          </Text>
          
          <View className="bg-blue-50 p-4 rounded-lg mb-6">
            <Text className="text-base text-slate-700 leading-relaxed">
              The Fitzpatrick Skin Type Scale is a classification system used in dermatology to categorize skin types based on their response to ultraviolet (UV) exposure, particularly in terms of tanning and burning tendencies.
            </Text>
            <Text className="text-base text-slate-700 leading-relaxed mt-2">
              Developed by Dr. Thomas Fitzpatrick in 1975, the scale ranges from Type I (very fair skin that always burns and never tans) to Type VI (very dark skin that never burns and deeply tans). It considers genetic factors (skin color, eye color, hair color) and reaction to sun exposure to determine a person's baseline skin type.
            </Text>
          </View>

          <Text className="text-xl font-semibold mb-4">
            Why is the Fitzpatrick Scale Important?
          </Text>

          <View className="space-y-5 mb-6">
            <View className="flex-row bg-green-50 p-4 rounded-lg">
              <Text className="text-green-600 mr-2 text-lg">✅</Text>
              <View className="flex-1">
                <Text className="font-semibold text-slate-800 mb-1">Risk assessment</Text>
                <Text className="text-slate-700">
                  Different skin types have different risks of developing sun-induced skin damage and skin cancers like melanoma. Lighter skin types (I–II) are at higher risk of UV-related damage and melanoma, while darker skin types (V–VI) have different risks and lesion presentations.
                </Text>
              </View>
            </View>
            
            <View className="flex-row bg-green-50 p-4 rounded-lg">
              <Text className="text-green-600 mr-2 text-lg">✅</Text>
              <View className="flex-1">
                <Text className="font-semibold text-slate-800 mb-1">Clinical relevance for AI screening</Text>
                <Text className="text-slate-700">
                  Skin type affects the appearance of moles, pigmentation patterns, and lesions on the skin. If you're training an AI model for melanoma detection, understanding the Fitzpatrick type ensures the model is evaluated across diverse skin tones, reducing bias and improving accuracy across populations.
                </Text>
              </View>
            </View>
            
            <View className="flex-row bg-green-50 p-4 rounded-lg">
              <Text className="text-green-600 mr-2 text-lg">✅</Text>
              <View className="flex-1">
                <Text className="font-semibold text-slate-800 mb-1">Personalized recommendations</Text>
                <Text className="text-slate-700">
                  Dermatologists use Fitzpatrick classification to tailor sun protection advice, screening frequency, and treatment plans for patients.
                </Text>
              </View>
            </View>
          </View>
          
          {/* Bottom Take Test button */}
          <View className="mt-6">
            <ButtonGlue className="w-full bg-blue-500 py-4 h-14 rounded-xl" onPress={handleNavigate}>
              <ButtonText className="text-white font-bold text-lg">Take the Test</ButtonText>
            </ButtonGlue>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FitzPatrick;