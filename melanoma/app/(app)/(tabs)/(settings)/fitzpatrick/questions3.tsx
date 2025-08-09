import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useSession } from '@/services/authContext';
import { ScrollView, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { RadioGroup, Radio, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { CircleIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import ModalComponent from '@/components/Modal';
import BackButton from '@/components/backButton';

import { useFitzpatrickStore } from '@/services/fitzPatrickStore';
import { fitzpatrickData } from '@/api/fitzpatrick';
import { accessTokenInterceptor } from '@/interceptor/accessToken.interceptor';

const Questions3 = () => {
  const { 
      faceSunExposure, 
      setFaceSunExposure,  
      familyHistoryMelanoma, 
      setFamilyHistoryMelanoma,
      immuneHealth, 
      setImmuneHealth,
      reset
    } = useFitzpatrickStore();
    const { userId, getCurrentToken } = useSession();
  
    const [notComplete, setNotComplete] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showModalV2, setShowModalV2] = useState(false);
    const [skinType, setSkinType] = useState('');
    
    const calculateSkinType = async() => {

        const accessToken = await getCurrentToken();
        if (!userId || !accessToken) return;
        const result = await fitzpatrickData(userId, accessToken, "FakeSession");
        
        const data = await result?.json();

        accessTokenInterceptor(data);
        if (data) {
          router.navigate("/(app)/(tabs)/(settings)")
          setSkinType(data.skinTypeAssessment);
          setShowModal(true);
          reset();
        }
    }

    const handleCancelRequest = () => {
      setShowModalV2(true);
    }
        
    useEffect(() => {
        if (faceSunExposure != '' && familyHistoryMelanoma != '' && immuneHealth != '' ) setNotComplete(false);
    },[faceSunExposure, familyHistoryMelanoma, immuneHealth]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <BackButton></BackButton>
      <Card className='mt-5 mb-5'>
        <Text style={{ marginBottom: 8 }}>
          Do you expose your face to the sun? (for the purpose of this quiz we have changed this
          question from the original: Did you expose the area to be treated to the sun?)
        </Text>
        <RadioGroup value={faceSunExposure} onChange={setFaceSunExposure}>
          {[
            { value: '1', label: 'Never' },
            { value: '2', label: 'Hardly ever' },
            { value: '3', label: 'Sometimes' },
            { value: '4', label: 'Often' },
            { value: '5', label: 'Always' },
          ].map(({ value, label }) => (
            <Radio key={value} value={value} size="md">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>{label}</RadioLabel>
            </Radio>
          ))}
        </RadioGroup>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>Do you have a family history of melanoma?</Text>
        <RadioGroup value={familyHistoryMelanoma} onChange={setFamilyHistoryMelanoma}>
          {[
            { value: 'Yes, immediate family (parent, sibling)', label: 'Yes, immediate family (parent, sibling)' },
            { value: 'Yes, extended family (aunt, uncle, grandparent)', label: 'Yes, extended family (aunt, uncle, grandparent)' },
            { value: 'No family history of melanoma', label: 'No family history of melanoma' },
          ].map(({ value, label }) => (
            <Radio key={value} value={value} size="md">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>{label}</RadioLabel>
            </Radio>
          ))}
        </RadioGroup>
      </Card>

      {/* Immune Health */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>Do you have a weakened immune system?</Text>
        <RadioGroup value={immuneHealth} onChange={setImmuneHealth}>
          {[
            { value: 'Yes, due to an autoimmune disease', label: 'Yes, due to an autoimmune disease' },
            { value: 'Yes, due to immunosuppressive treatment (e.g., chemotherapy, steroids)', label: 'Yes, due to immunosuppressive treatment (e.g., chemotherapy, steroids)' },
            { value: 'No, I do not have a weakened immune system', label: 'No, I do not have a weakened immune system' },
          ].map(({ value, label }) => (
            <Radio key={value} value={value} size="md">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>{label}</RadioLabel>
            </Radio>
          ))}
        </RadioGroup>
      </Card>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 5 }}>
        <ButtonGlue className="border border-gray-500 text-gray-500 px-4 py-2 rounded-md"
           style={{ flex: 1 }} onPress={handleCancelRequest}>
          <ButtonText>Cancel</ButtonText>
        </ButtonGlue>

        <ButtonGlue className='bg-blue-600' isDisabled={notComplete} style={{ flex: 1 }} onPress={calculateSkinType}>
          <ButtonText>Calculate</ButtonText>
        </ButtonGlue>

      </View>

      
      <ModalComponent 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        titleContent={`Test Completed! Skin Type -> ${skinType}`}
        bodyContent="You are now eligible for mole checking."
        primaryButtonText="Go to Camera"
        secondaryButtonText="Cancel"
        primaryButtonAction={() => {
            setShowModal(false);
            router.push("/(app)/(tabs)/(photo)"); // or your profile route
            }}
            secondaryButtonAction={() => setShowModal(false)}        
      />

      <ModalComponent
       isOpen={showModalV2}
       onClose={() => setShowModalV2(false)}
       titleContent=""
       bodyContent="You are going back to settings page"
       primaryButtonText="Go to Settings"
       secondaryButtonText="Cancel"
       primaryButtonAction={() => {
           setShowModalV2(false);
           router.navigate("/(app)/(tabs)/(settings)"); // or your profile route
           }}
           secondaryButtonAction={() => setShowModalV2(false)}        
      />
    </ScrollView>
  );
};

export default Questions3;
