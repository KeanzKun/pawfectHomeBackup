import React from 'react';
import { View, Text, Button, TouchableOpacity,StyleSheet,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color, FontFamily } from "../GlobalStyles";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const TextStroke = ({ children, stroke, strokeWidth, style, ...props }) => {
    return (
      <View style={{ position: 'relative' }}>
        {['left', 'right', 'top', 'bottom'].map((direction) => (
          <Text {...props} style={[style, { position: 'absolute', textShadowColor: stroke, textShadowRadius: strokeWidth, textShadowOffset: { width: direction === 'right' ? -strokeWidth : strokeWidth, height: direction === 'bottom' ? -strokeWidth : strokeWidth } }]} key={direction}>
            {children}
          </Text>
        ))}
        <Text {...props} style={style}>
          {children}
        </Text>
      </View>
    );
  };


export default TextStroke;
