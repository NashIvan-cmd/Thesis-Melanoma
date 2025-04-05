import React from 'react';
import { View } from 'react-native';

const Divider = ({ color = '#D3D3D3', thickness = 1, style = {} }) => {
  return (
    <View
      style={{
        height: thickness,
        backgroundColor: color,
        width: '100%',
        ...style
      }}
    />
  );
};

export default Divider;