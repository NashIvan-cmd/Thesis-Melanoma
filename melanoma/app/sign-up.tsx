import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button as ButtonGlue, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { 
  Modal, 
  ModalBackdrop, 
  ModalHeader, 
  ModalBody, 
  ModalContent, 
  ModalCloseButton 
} from '@/components/ui/modal';

import { API_URL } from '@env';
import { router } from 'expo-router';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [code, setCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);

  const handleSubmitRequest = async() => {
    try {
      console.log('Executing handle submit request');
      
      if (code === '') {
        setModalMessage('Missing verification code!');
        setIsModalOpen(true);
        return;
      }

      if (code != verificationCode) {
        setModalMessage('Verification code does not match');
        setIsModalOpen(true);
        return;
      }

      if (username === '' || email === '' || password === '') {
        setModalMessage('Fields cannot be empty!');
        setIsModalOpen(true);
        return;
      }

      if (password !== confirmPassword) {
        setModalMessage('Passwords do not match!');
        setIsModalOpen(true);
        return;
      }

      setIsLoading(true);
      
      const result = await fetch(`${API_URL}/v1/new/account`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await result.json();
      setIsLoading(false);

      if (data.success == true) {
        setModalMessage("Account created successfully");
        setIsModalOpen(true);
        setUsername('');
        setConfirmPassword('');
        setPassword('');
        setEmail('');
        setCode('');
        setCodeRequested(false);
      } else {
        setModalMessage(data.message || "Failed to create account");
        setIsModalOpen(true);
      }
    } catch (error) {
      setIsLoading(false);
      setModalMessage("An error occurred. Please try again.");
      setIsModalOpen(true);
      console.error(error);
    }
  };

  const handleGenerateCodeRequest = async() => {
    if (!email || !email.includes('@')) {
      setModalMessage('Please enter a valid email address');
      setIsModalOpen(true);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/code/account`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      });

      const data = await response.json();
      setIsLoading(false);
      console.log('Verification code', data.code);

      setVerificationCode(data.code);
      setCodeRequested(true);
      setModalMessage('Verification code sent to your email');
      setIsModalOpen(true);
    } catch (error) {
      setIsLoading(false);
      setModalMessage("Failed to generate verification code");
      setIsModalOpen(true);
      console.error("Error @ handle generate code", error);
    }
  }

  const handleBackRequest = () => {
    router.navigate('/sign-in');
  }
  
  const ModalAny = Modal as any;
  return ( 
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create Account
          </Text>
          
          <View className="bg-white rounded-xl p-6 shadow-md mb-4">
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 font-medium mb-1">Username</Text>
                <Input size='md' className="rounded-lg border border-gray-200">
                  <InputField 
                    type='text' 
                    value={username} 
                    onChangeText={setUsername} 
                    placeholder='e.g JohnDoe' 
                    className="p-2"
                  />
                </Input>
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-1">Email</Text>
                <Input className="rounded-lg border border-gray-200">
                  <InputField 
                    type='text' 
                    value={email} 
                    onChangeText={setEmail} 
                    placeholder='e.g JohnDoe@gmail.com' 
                    className="p-2"
                  />
                </Input>
              </View>

              {email != '' && (
                <ButtonGlue 
                  onPress={handleGenerateCodeRequest}
                  disabled={isLoading}
                  className={`rounded-lg py-3 h-12 w-full ${codeRequested ? 'bg-green-500' : 'bg-blue-500'}`}
                >
                  <ButtonText className="font-medium text-white">
                    {isLoading ? 'Sending...' : codeRequested ? 'Resend Code' : 'Generate Verification Code'}
                  </ButtonText>
                </ButtonGlue>
              )}

              <View>
                <Text className="text-gray-700 font-medium mb-1">Verification Code</Text>
                <Input className="rounded-lg border border-gray-200">
                  <InputField 
                    type='text' 
                    value={code} 
                    onChangeText={setCode}
                    placeholder="Enter verification code"
                    className="p-2"
                  />
                </Input>
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-1">Password</Text>
                <Input className="rounded-lg border border-gray-200">
                  <InputField 
                    type='password' 
                    value={password} 
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    className="p-2"
                  />
                </Input>
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-1">Confirm Password</Text>
                <Input className="rounded-lg border border-gray-200">
                  <InputField 
                    type='password' 
                    value={confirmPassword} 
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    className="p-2"
                  />
                </Input>
              </View>
            </View>
          </View>
          
          <View className="space-y-3">
            <ButtonGlue 
              onPress={handleSubmitRequest}
              disabled={isLoading}
              className="rounded-lg py-4 h-14 bg-blue-500 w-full"
            >
              <ButtonText className="font-semibold text-base text-white">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </ButtonText>
            </ButtonGlue>

            <ButtonGlue 
              onPress={handleBackRequest}
              className="rounded-lg py-3 h-12 bg-gray-200 w-full mt-2"
            >
              <ButtonText className="font-medium text-gray-800">
                Back to Sign In
              </ButtonText>
            </ButtonGlue>
          </View>
        </View>
      </ScrollView>

      {/* Modal always mounted, only shown if open */}
      {isModalOpen && (
        <ModalAny isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalBackdrop />
          <ModalContent className="bg-white rounded-xl p-4 mx-4">
            <ModalHeader>
              <Text className="text-lg font-bold">Notification</Text>
              <ModalCloseButton onPress={() => setIsModalOpen(false)}>
                <Text className="text-gray-500 text-xl">×</Text>
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text className="text-center py-2">{modalMessage}</Text>
              <ButtonGlue
                onPress={() => setIsModalOpen(false)}
                className="mt-4 rounded-lg py-2 bg-blue-500"
              >
                <ButtonText className="text-white">OK</ButtonText>
              </ButtonGlue>
            </ModalBody>
          </ModalContent>
        </ModalAny>
      )}
    </SafeAreaView>
  );
};

export default Signup;