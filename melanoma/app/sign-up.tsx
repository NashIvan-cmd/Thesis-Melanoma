import { View, Text } from 'react-native';
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

  const handleSubmitRequest = async() => {
    try {
      console.log('Executing handle submit request');
      console.log("Username: ", username);
      console.log("Email: ", email);

      if (code === '') {
        setModalMessage('Missing verificiation code!');
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

      if (data.success == true) {
        setModalMessage("Account created successfully");
        setIsModalOpen(true);
        setUsername('');
        setConfirmPassword('');
        setPassword('');
        setEmail('');
        setCode('');
      }

      // Proceed with signup request here
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateCodeRequest = async() => {
    try {
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
      console.log('Verification code', data.code);

      setVerificationCode(data.code);
    } catch (error) {
      console.error("Error @ handle generate code", error);
    }
  }

  const handleBackRequest = () => {
    router.navigate('/sign-in');
  }
  return ( 
    <SafeAreaView>
      <View>
        <Input size='md' className='mt-3'>
          <Text>Username: </Text>
          <InputField type='text' value={username} onChangeText={setUsername} placeholder='e.g JohnDoe' />
        </Input>

        <Input className='mt-3'>
          <Text>Email: </Text>
          <InputField type='text' value={email} onChangeText={setEmail} placeholder='e.g JohnDoe@gmail.com' />
        </Input>

        {email != '' ?
          <ButtonGlue onPress={handleGenerateCodeRequest}>
            <ButtonText>Generate verification code</ButtonText>
          </ButtonGlue>
        :
          <></>
        }

        <Input>
          <Text>Code: </Text>
          <InputField type='text' value={code} onChangeText={setCode}/>
        </Input>

        <Input className='mt-3'>
          <Text>Password: </Text>
          <InputField type='password' value={password} onChangeText={setPassword} />
        </Input>

        <Input className='mt-3'>
          <Text>Confirm Password: </Text>
          <InputField type='password' value={confirmPassword} onChangeText={setConfirmPassword} />
        </Input>

        <ButtonGlue onPress={handleSubmitRequest}>
          <ButtonText>Submit</ButtonText>
        </ButtonGlue>

        <ButtonGlue onPress={handleBackRequest}>
          <ButtonText>Back</ButtonText>
        </ButtonGlue>
      </View>

      {/* Modal always mounted, only shown if open */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton onPress={() => setIsModalOpen(false)} > </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text>{modalMessage}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Signup;
