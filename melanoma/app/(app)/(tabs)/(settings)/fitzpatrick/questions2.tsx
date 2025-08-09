import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { Card } from '@/components/ui/card';
import { RadioGroup, Radio, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { CircleIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import { useFitzpatrickStore } from '@/services/fitzPatrickStore';
import BackButton from '@/components/backButton';

const Questions2 = () => {
  const {
    brownAfterSun,
    setBrownAfterSun,
    faceReactionToSun,
    setFaceReactionToSun,
    lastSunExposure,
    setLastSunExposure,
  } = useFitzpatrickStore();
  const [notComplete, setNotComplete] = useState(true);

  const handleNavigate = () => {
     router.navigate("/fitzpatrick/questions4");
    }
    
    useEffect(() => {
        if (brownAfterSun != '' && faceReactionToSun != '' && lastSunExposure != '' ) setNotComplete(false);
    },[brownAfterSun, faceReactionToSun, lastSunExposure]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Turn Brown */}
      <BackButton></BackButton>
      <Card style={{ marginBottom: 16, marginTop: 20 }}>
        <Text style={{ marginBottom: 8 }}>Do you turn brown after several hours of sun exposure?</Text>
        <RadioGroup value={brownAfterSun} onChange={setBrownAfterSun}>
          {[
            { value: '0', label: 'Never' },
            { value: '1', label: 'Seldom' },
            { value: '2', label: 'Sometimes' },
            { value: '3', label: 'Often' },
            { value: '4', label: 'Always' },
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

      {/* Face Reaction */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>How does your face react to the sun?</Text>
        <RadioGroup value={faceReactionToSun} onChange={setFaceReactionToSun}>
          {[
            { value: '0', label: 'Very sensitive' },
            { value: '1', label: 'Sensitive' },
            { value: '2', label: 'Normal' },
            { value: '3', label: 'Very resistant' },
            { value: '4', label: 'Never had a problem' },
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

      {/* Last Exposure */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>
          When did you last expose your body to the sun (or artificial sunlamp/tanning cream)?
        </Text>
        <RadioGroup value={lastSunExposure} onChange={setLastSunExposure}>
          {[
            { value: '1', label: 'More than 3 months ago' },
            { value: '2', label: '2-3 months ago' },
            { value: '3', label: '12 months ago' },
            { value: '4', label: 'Less than a month ago' },
            { value: '5', label: 'Less than 2 weeks ago' },
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
          <ButtonText>Next 3/5</ButtonText>
        </ButtonGlue>
    </ScrollView>
  );
};

export default Questions2;
