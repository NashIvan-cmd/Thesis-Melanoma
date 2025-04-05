import { View, Text } from 'react-native'
import React from 'react'

import AntDesign from '@expo/vector-icons/AntDesign';

import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
  } from "@/components/ui/modal"
import { Button as ButtonGlue, ButtonText } from './ui/button'

import Divider from './Divider';

interface ModalComponentProps {
    isOpen: boolean;
    isAvoidKeyboard?: boolean;
    closeOnOverlayClick?: boolean;
    onClose?: () => void;
    bodyContent?: string;
    titleContent?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    primaryButtonAction: () => void;
    secondaryButtonAction: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ 
    isOpen,
    isAvoidKeyboard, 
    closeOnOverlayClick,
    onClose,
    bodyContent,
    titleContent,
    primaryButtonText,
    secondaryButtonText,
    primaryButtonAction,
    secondaryButtonAction
}) => {
  return (
    <Modal 
        isOpen={isOpen} 
        avoidKeyboard={isAvoidKeyboard} 
        closeOnOverlayClick={closeOnOverlayClick} 
        onClose={onClose} 
    >
        <ModalBackdrop />
        <ModalContent>
            <ModalHeader>
                <Text>{titleContent}</Text>
                <ModalCloseButton><AntDesign name="close" size={24} color="black" onPress={onClose}/></ModalCloseButton>
            </ModalHeader>
            <ModalBody><Text>{bodyContent}</Text></ModalBody>
            <Divider color='#000' thickness={2} />
            <ModalFooter className='w-100 mt-3'>
                <ButtonGlue className='w-25' onPress={secondaryButtonAction}>
                    <ButtonText>{secondaryButtonText}</ButtonText>
                </ButtonGlue>
                <ButtonGlue className='w-25' onPress={primaryButtonAction}>
                    <ButtonText>{primaryButtonText}</ButtonText>
                </ButtonGlue>
            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export default ModalComponent