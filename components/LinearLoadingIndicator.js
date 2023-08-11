import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import { Color } from '../GlobalStyles';

const LinearLoadingIndicator = () => {
  const progress = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000, // 1 second
        useNativeDriver: false,
      }),
      { iterations: -1 } // -1 means infinite iterations
    ).start();
  }, [progress]);

  return (
    <View style={{ height: 3, backgroundColor: '#f0f0f0', width: '100%' }}>
      <Animated.View
        style={{
          height: 3,
          backgroundColor: Color.sandybrown,
          width: '40%', // Line width, you can adjust this
          left: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['-100%', '100%'], // Line will move from 0% to 80% and then loop
          }),
        }}
      />
    </View>
  );
};

export default LinearLoadingIndicator;
