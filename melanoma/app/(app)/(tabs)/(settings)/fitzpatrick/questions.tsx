import React, { useEffect, useState} from 'react';
import { ScrollView } from 'react-native';
import { Card } from '@/components/ui/card';
import { RadioGroup, Radio, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import BackButton from '@/components/backButton';

import { useFitzpatrickStore } from '@/services/fitzPatrickStore';
import { router } from 'expo-router';
import { API_URL } from '@env';
import { useSession } from '@/services/authContext';

const Questions = () => {
  const { userId } = useSession();
  const { 
    eyeColor, 
    setEyeColor, 
    hairColor, 
    setHairColor, 
    skinColor, 
    setSkinColor } = useFitzpatrickStore();
  const [notComplete, setNotComplete] = useState(true);
  
  const handleNavigate = () => {
    router.navigate("/fitzpatrick/questions1");
  }

  useEffect(() => {
    const fetchFitzPatrickId = async() => {
        try {
            const fitzId = await fetch(`${API_URL}/v1/fitzPatrick/${userId}`, {
                method: "GET"
            });
        } catch (error) {
            throw error;
        }

    fetchFitzPatrickId();
    }
  }, []);

  useEffect(() => {
    if (eyeColor != '' && skinColor != '' && hairColor != '' ) setNotComplete(false);
  },[eyeColor, skinColor, hairColor]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <BackButton></BackButton>
      {/* Eye Color */}
      <Card style={{ marginBottom: 16, marginTop: 20 }}>
        <Text style={{ marginBottom: 8 }}>What color are your eyes?</Text>
        <RadioGroup value={eyeColor} onChange={setEyeColor}>
          {[
            { value: '0', label: 'Light blue, gray, green' },
            { value: '1', label: 'Blue, gray, or green' },
            { value: '2', label: 'Blue' },
            { value: '3', label: 'Dark brown' },
            { value: '4', label: 'Brownish black' },
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

      {/* Hair Color */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>What is your natural hair color?</Text>
        <RadioGroup value={hairColor} onChange={setHairColor}>
          {[
            { value: '0', label: 'Sandy red' },
            { value: '1', label: 'Blonde' },
            { value: '2', label: 'Chestnut/Dark Blonde' },
            { value: '3', label: 'Dark brown' },
            { value: '4', label: 'Black' },
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

      {/* Skin Color */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>What is your skin color (unexposed areas)?</Text>
        <RadioGroup value={skinColor} onChange={setSkinColor}>
          {[
            { value: '0', label: 'Reddish' },
            { value: '1', label: 'Very Pale' },
            { value: '2', label: 'Pale with a beige tint' },
            { value: '3', label: 'Light brown' },
            { value: '4', label: 'Dark brown' },
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

      <ButtonGlue className='bg-blue-600' isDisabled={notComplete} onPress={handleNavigate}>
        <ButtonText>Next 1/5</ButtonText>
      </ButtonGlue>
      
    </ScrollView>
  );
};

export default Questions;
