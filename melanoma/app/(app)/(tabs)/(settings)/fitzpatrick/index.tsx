import { View, Text } from 'react-native';
import React from 'react';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';

import BackButton from '@/components/backButton';

const FitzPatrick = () => {
  const handleNavigate = () => {
    router.navigate('/(app)/(tabs)/(settings)/fitzpatrick/questions');
  };

  return (
    <View className="flex-1 p-6 justify-center">
      <BackButton></BackButton>
      <Text className="text-2xl font-bold mb-4 text-center">
        What is the Fitzpatrick Skin Type Scale?
      </Text>
      <Text className="text-base text-slate-700 mb-6 leading-relaxed">
        The Fitzpatrick Skin Type Scale is a classification system used in dermatology to categorize skin types based on their response to ultraviolet (UV) exposure, particularly in terms of tanning and burning tendencies.
        Developed by Dr. Thomas Fitzpatrick in 1975, the scale ranges from Type I (very fair skin that always burns and never tans) to Type VI (very dark skin that never burns and deeply tans). It considers genetic factors (skin color, eye color, hair color) and reaction to sun exposure to determine a person’s baseline skin type.
      </Text>

      <Text className="text-lg font-semibold mb-3">
        Why is the Fitzpatrick Scale Important?
      </Text>

      <View className="space-y-3 mb-6">
        <Text className="text-slate-700">
          ✅ <Text className="font-semibold">Risk assessment</Text> – Different skin types have different risks of developing sun-induced skin damage and skin cancers like melanoma. Lighter skin types (I–II) are at higher risk of UV-related damage and melanoma, while darker skin types (V–VI) have different risks and lesion presentations.
        </Text>
        <Text className="text-slate-700">
          ✅ <Text className="font-semibold">Clinical relevance for AI screening</Text> – Skin type affects the appearance of moles, pigmentation patterns, and lesions on the skin. If you're training an AI model for melanoma detection, understanding the Fitzpatrick type ensures the model is evaluated across diverse skin tones, reducing bias and improving accuracy across populations.
        </Text>
        <Text className="text-slate-700">
          ✅ <Text className="font-semibold">Personalized recommendations</Text> – Dermatologists use Fitzpatrick classification to tailor sun protection advice, screening frequency, and treatment plans for patients.
        </Text>
      </View>

      <ButtonGlue className="w-full mt-auto">
        <ButtonText onPress={handleNavigate}>Take the Test</ButtonText>
      </ButtonGlue>
    </View>
  );
};

export default FitzPatrick;
