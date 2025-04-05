import { Text } from 'react-native'
import React, { useState } from 'react'

import { Pressable } from './ui/pressable'

type Pressable_props = {
    label: string;
    onPressOut?: () => void;
}

export const Primary_Pressable = ( {label, onPressOut}: Pressable_props ) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
      <Pressable 
        onPressOut={() => {
            setIsPressed(false); 
            onPressOut?.();
        }}
        onPressIn={() => setIsPressed(true)}
        style={{
            backgroundColor: isPressed ? '#FFFFFF' : '#F97316',
            height: 50, // h-14 = 14 * 4px = 56px
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8, // rounded-lg
          }}
      >
        <Text className='font-extrabold text-lg'>{label}</Text>
      </Pressable>
  )
}

export const Secondary_Pressable = ( {label, onPressOut}: Pressable_props ) => {
    return (
        <Pressable 
            className='bg-white h-14 items-center justify-center rounded-lg'
            onPressOut={onPressOut}
        >
          <Text className='font-semibold text-md'>{label}</Text>
        </Pressable>
    )
  }
