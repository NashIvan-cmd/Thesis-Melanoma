import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Text, View, TouchableOpacity } from 'react-native';

import { useSession } from '@/services/authContext';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Input, InputField } from '@/components/ui/input';
import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { API_URL } from '@env';

export default function SignIn() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSignUpRequest = () => {
    router.navigate('/sign-up');
  }

  const handleForgotPassword = async() => {
    try {
      // console.log("Forgot request running");
      // const result = await fetch(`${API_URL}/v1/password/reset`,{ 
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     username,
      //     email: username
      //   })
      // })

      // const data = await result.json();

      // if (data) router.navigate("/forgetPass");
      router.navigate("/forgetPass");
    } catch (error) {
      console.error("Error @ handle forgot password", error);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log({ username, password });
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [username, password]);
  
  const { signIn } = useSession();
  
  return (
    <GluestackUIProvider>
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <View className="w-full max-w-md bg-white rounded-xl p-6 shadow-md">
          <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
            Melanoma App
          </Text>
          
          <View className="space-y-4">
            <Input
              size="md"
              className="mb-2 rounded-lg border border-gray-200"
            >
              <InputField
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setError('');
                }}
                type="text"
                placeholder="Username"
                className="p-2"
              />
            </Input>
            
            <Input
              size="md"
              className="mb-4 rounded-lg border border-gray-200"
            >
              <InputField
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                type="password"
                placeholder="Password"
                className="p-2"
              />
            </Input>
            
            {error ? (
              <Text className="text-red-500 text-center mb-2">
                {error}
              </Text>
            ) : null}
            
            <ButtonGlue
              size="lg"
              className="rounded-lg py-4 h-14 bg-blue-500 w-full"
              onPress={async() => {
                try {
                  const boolRes = await signIn(username, password);
                  
                  console.log("Boolean Result", boolRes);
                  if (boolRes) {
                    console.log("replacing the route");
                    router.replace("/");
                  } else {
                    setError("Invalid username or password");
                    console.log("Wrong credentials");
                  }
                } catch (err) {
                  setError("An error occurred. Please try again.");
                  console.error(err);
                }
              }}
            >
              <ButtonText className="font-semibold text-base">Sign In</ButtonText>
            </ButtonGlue>
          </View>

          <View className="flex-row justify-center items-center mt-6 space-x-1">
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text className="text-blue-500 font-semibold">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row justify-center items-center mt-2 space-x-1">
            <Text className="text-gray-600">No account yet?</Text>
            <TouchableOpacity onPress={handleSignUpRequest}>
              <Text className="text-blue-500 font-semibold"> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GluestackUIProvider>
  );
}