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
import BackButton from '@/components/backButton';

import { useFitzpatrickStore } from '@/services/fitzPatrickStore';

const Questions4 = () => {
  const { 
    age, 
    setAge, 
    gender, 
    setGender,
    weeklyHoursSun,
    setWeeklyHoursSun
  } = useFitzpatrickStore();
  
  const { userId, accessToken } = useSession();
  const [notComplete, setNotComplete] = useState(true);
  
  const handleNavigate = () => {
    router.navigate("/fitzpatrick/questions3");
  };
  
  useEffect(() => {
    if (
      gender !== '' &&
      age !== '' &&
      weeklyHoursSun !== ''
    ) {
      setNotComplete(false);
    } else {
      setNotComplete(true);
    }
  }, [gender, age, weeklyHoursSun]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <BackButton></BackButton>
      
      <Card style={{ marginBottom: 16, marginTop: 20 }}>
        <Text style={{ marginBottom: 8 }}>In the past week, how many hours have you averaged under the sun?</Text>
        <RadioGroup value={weeklyHoursSun} onChange={setWeeklyHoursSun}>
          {[
            { value: 'Less than 1 hour', label: 'Less than 1 hour' },
            { value: '1-3 hours', label: '1-3 hours' },
            { value: '4-7 hours', label: '4-7 hours' },
            { value: '8-14 hours', label: '8-14 hours' },
            { value: 'More than 14 hours', label: 'More than 14 hours' },
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
        <Input style={{ marginBottom: 16 }}>
          <Text>Age: </Text>
          <InputField 
            keyboardType='numeric' 
            onChangeText={setAge} 
            value={age} 
          />
        </Input>
        
        <Text style={{ marginBottom: 8 }}>Sex</Text>
        <RadioGroup value={gender} onChange={setGender}>
          <Radio value="male" size="md">
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Male</RadioLabel>
          </Radio>
          <Radio value="female" size="md">
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Female</RadioLabel>
          </Radio>
        </RadioGroup>
      </Card>

      <View style={{ marginTop: 16 }}>
        <ButtonGlue 
          isDisabled={notComplete} 
          onPress={handleNavigate} 
          style={{ width: '100%' }}
          className='bg-blue-600'
        > 
          <ButtonText>Next 4/5</ButtonText>
        </ButtonGlue>
      </View>
    </ScrollView>
  );
};

export default Questions4;