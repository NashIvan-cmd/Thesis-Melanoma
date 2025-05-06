import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { Card } from '@/components/ui/card';
import { RadioGroup, Radio, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { CircleIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import BackButton from '@/components/backButton';

import { useFitzpatrickStore } from '@/services/fitzPatrickStore';

const Questions1 = () => {
  const { freckles, setFreckles, sunBurnReaction, setSunBurnReaction, tanReaction, setTanReaction } = useFitzpatrickStore();
  const [notComplete, setNotComplete] = useState(true);
    
    const handleNavigate = () => {
      router.navigate("/fitzpatrick/questions2");
    }
  
    useEffect(() => {
      if (freckles != '' && sunBurnReaction != '' && tanReaction != '' ) setNotComplete(false);
    },[freckles, sunBurnReaction, tanReaction]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Freckles */}
      <BackButton></BackButton>
      <Card style={{ marginBottom: 16, marginTop: 20 }}>
        <Text style={{ marginBottom: 8 }}>Do you have freckles on unexposed areas?</Text>
        <RadioGroup value={freckles} onChange={setFreckles}>
          {[
            { value: '0', label: 'Many' },
            { value: '1', label: 'Several' },
            { value: '2', label: 'Few' },
            { value: '3', label: 'Incidental' },
            { value: '4', label: 'None' },
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

      {/* Sun Reaction */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>What happens when you stay too long in the sun?</Text>
        <RadioGroup value={sunBurnReaction} onChange={setSunBurnReaction}>
          {[
            { value: '0', label: 'Painful redness, blistering, peeling' },
            { value: '1', label: 'Blistering followed by peeling' },
            { value: '2', label: 'Burns sometimes followed by peeling' },
            { value: '3', label: 'Rare burns' },
            { value: '4', label: 'Never had burns' },
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

      {/* Tanning Ability */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 8 }}>To what degree do you turn brown?</Text>
        <RadioGroup value={tanReaction} onChange={setTanReaction}>
          {[
            { value: '0', label: 'Hardly or not at all' },
            { value: '1', label: 'Light color tan' },
            { value: '2', label: 'Reasonable tan' },
            { value: '3', label: 'Tan very easily' },
            { value: '4', label: 'Turn dark brown quickly' },
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

      <ButtonGlue isDisabled={notComplete} onPress={handleNavigate}>
        <ButtonText>Next</ButtonText>
      </ButtonGlue>
    </ScrollView>
  );
};

export default Questions1;
