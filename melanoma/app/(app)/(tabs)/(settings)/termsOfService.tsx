import React, { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from "react-native";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import BackButton from '@/components/backButton';
import { CheckIcon } from "@/components/ui/icon";
import { Button as ButtonGlue, ButtonText } from "@/components/ui/button";
import { useSession } from '@/services/authContext';
import { API_URL } from '@env';
import { router } from 'expo-router';
import ModalComponent from '@/components/Modal';
import { accessTokenInterceptor } from '@/interceptor/accessToken.interceptor';

interface dataRes {
  success: string;
  message: string; 
}

export default function AppPolicy() {
  const { userId, accessToken } = useSession();
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchAgreement = async() => {
        console.log("Running this on focus", userId);
        const result = await fetch(`${API_URL}/v1/agreement/check?userId=${userId}`, {
        method: "GET"
      })
        const data = await result.json();

        console.log("data", data);

        if (data.result.policyAgreement) setAgreed(true);
      }
      fetchAgreement();
    }, [userId])
  );
  const handleAgree = async() => {
    try {
      const result = await fetch(`${API_URL}/v1/agreement/account`,{
        method: "POST",
        headers: {
          "Content-Type": 'application/json',
          "Authorization": accessToken ? `Bearer ${accessToken}` : ''
        },
        body: JSON.stringify({
          boolAns: agreed,
          id: userId
        })
      });

      // console.log({ result });
      const data = await result.json();

      accessTokenInterceptor(data);
      console.log("Parsed result", data);

      if (data) {
        setShowModal(true);
      }
      
    } catch (error) {
      console.error("Error @ handle agree", error);
    }
    // Here you would handle saving the user's agreement to your state management
    // and navigate back or to next step
    console.log("User agreed to terms");
    // navigation.goBack() or navigation.navigate('NextScreen')
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <BackButton></BackButton>
        <View style={styles.container}>
          <Text className="text-2xl font-extrabold text-blue-800 mb-6">Terms of Service & Privacy Policy</Text>
          
          <View className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-5">
            <Text className="text-lg font-bold text-blue-800 mb-3">Privacy Act Compliance</Text>
            <Text className="text-slate-700 mb-4">
              This application complies with Republic Act No. 10173, also known as the "Data Privacy Act of 2012" of the Philippines. We are committed to protecting your personal information and sensitive personal information in accordance with this law.
            </Text>
            
            <Text className="text-slate-700 mb-1">Under this compliance:</Text>
            <Text className="text-slate-700 mb-1">• We collect only necessary data for the app's functionality</Text>
            <Text className="text-slate-700 mb-1">• Your data is stored securely with appropriate safeguards</Text>
            <Text className="text-slate-700 mb-1">• You have the right to access and correct your personal information</Text>
            <Text className="text-slate-700 mb-4">• You may withdraw consent and request data deletion</Text>
          </View>
          
          <View className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-5">
            <Text className="text-lg font-bold text-blue-800 mb-3">Medical Disclaimer</Text>
            <Text className="text-slate-700 mb-4">
              This application is NOT a replacement for professional medical advice, diagnosis, or treatment from a qualified dermatologist.
            </Text>
            
            <Text className="text-slate-700 mb-1">Important points to understand:</Text>
            <Text className="text-slate-700 mb-1">• The app provides preliminary analysis only</Text>
            <Text className="text-slate-700 mb-1">• Results may not be 100% accurate</Text>
            <Text className="text-slate-700 mb-1">• Always consult a dermatologist for proper diagnosis</Text>
            <Text className="text-slate-700 mb-4">• Seek immediate medical attention for concerning skin changes</Text>
            
            <Text className="text-slate-700 font-medium mb-1">We strongly recommend:</Text>
            <Text className="text-slate-700 mb-4">Regular check-ups with a dermatologist regardless of app results.</Text>
          </View>
          
          <View className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
            <Text className="text-lg font-bold text-blue-800 mb-3">User Data Sharing Liability</Text>
            <Text className="text-slate-700 mb-4">
              While we take all reasonable measures to protect your data within our application, you acknowledge and agree that:
            </Text>
            
            <Text className="text-slate-700 mb-1">• Any data you choose to share outside the app is your responsibility</Text>
            <Text className="text-slate-700 mb-1">• Screenshots, exports, or manual sharing of your skin analysis or personal information is done at your own risk</Text>
            <Text className="text-slate-700 mb-1">• We are not liable for any consequences resulting from your decision to share app data publicly</Text>
            <Text className="text-slate-700 mb-4">• We recommend keeping your health information private and secure</Text>
          </View>
          
          <View className="w-full mb-8">
            <Checkbox value="agree" isChecked={agreed} onChange={(isSelected) => setAgreed(isSelected)}>
              <CheckboxIndicator className="h-6 w-6 border-2 rounded border-blue-600 mr-2">
                <CheckboxIcon as={CheckIcon} className="h-4 w-4 text-blue-600" />
              </CheckboxIndicator>
              <CheckboxLabel className="text-slate-700">
                I acknowledge that I have read, understood, and agree to all the terms and conditions stated above.
              </CheckboxLabel>
            </Checkbox>
          </View>
          
          <ButtonGlue 
            onPress={handleAgree}
            isDisabled={!agreed}
            className={agreed ? "bg-blue-600 w-full" : "bg-slate-300 w-full"}
          >
            <ButtonText>Agree & Continue</ButtonText>
          </ButtonGlue>
        </View>

        <ModalComponent
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          titleContent=""
          bodyContent = "Thank you for agreeing to our policy terms."
          primaryButtonText="Melanoma test"
          secondaryButtonText="Close"
          primaryButtonAction={() => {
            setShowModal(false);
            router.navigate("/(app)/(tabs)/(photo)")
          }}
          secondaryButtonAction={() => setShowModal(false)}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingTop: 15,
    marginTop: 15
  },
});