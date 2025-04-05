import React, { useState } from 'react';
import { View } from 'react-native';

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
  dotSize?: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({ 
  total, 
  currentIndex,
  dotSize = 8  // default size in pixels
}) => {
  return (
    <View className="flex-row gap-2 justify-center items-center my-4">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`rounded-full ${
            currentIndex === i 
              ? 'bg-blue-500 w-2 h-2' 
              : 'bg-gray-300/50 w-1.5 h-1.5'
          }`}
        />
      ))}
    </View>
  );
};
