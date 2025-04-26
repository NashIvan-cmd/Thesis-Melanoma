import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { useSession } from '@/services/authContext';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Input, InputField } from '@/components/ui/input';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import Signup from './sign-up';

export default function SignIn() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignUpRequest = () => {
    router.navigate('/sign-up');
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log({ username, password });
    }, 3000);

    return () => clearTimeout(timeoutId);
  },[username, password]);
  
  const { signIn } = useSession();
  return (
    <GluestackUIProvider>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Input size='md'>
        <InputField value={username} onChangeText={setUsername} type='text' placeholder='Username' />
      </Input>
      <Input size='md'>
        <InputField value={password} onChangeText={setPassword} type='password' placeholder='Password' className='text-black' />
      </Input>
      <ButtonGlue size='md' variant='solid' onPress={async() => {
        const boolRes = await signIn(username, password);

        console.log("Boolean Result", boolRes);

        if (boolRes) {
           router.replace('/');
        } else {
          console.log("Wrong credentials");
        }
       
      }}>
        <ButtonText>Sign In</ButtonText>
      </ButtonGlue>
      <Text>No Account yet?</Text>
      <ButtonGlue onPress={handleSignUpRequest}>
        <ButtonText>Sign Up</ButtonText>
      </ButtonGlue>
    </View>
    </GluestackUIProvider>
  );
}
