import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { themeColors } from '../../theme';

const ThemeLoader = ({ size = 50, thickness = 5, isActive = true }) => {
  // Get the device color scheme
  const colorScheme = useColorScheme() || 'light';
  const theme = themeColors[colorScheme];
  
  // Animation references
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  
  // Control animations based on isActive prop
  useEffect(() => {
    let rotationAnimation;
    let pulseAnimation;
    
    if (isActive) {
      // Start rotation animation
      rotationAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      );
      rotationAnimation.start();
      
      // Start pulsing animation
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.6,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    } else {
      // Stop animations when not active
      rotateAnim.stopAnimation();
      scaleAnim.stopAnimation();
      
      // Reset to default values when not active
      rotateAnim.setValue(0);
      scaleAnim.setValue(0.6);
    }
    
    // Clean up animations on unmount or when isActive changes
    return () => {
      if (rotationAnimation) rotationAnimation.stop();
      if (pulseAnimation) pulseAnimation.stop();
    };
  }, [isActive, rotateAnim, scaleAnim]);
  
  // Interpolate rotation animation
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Don't render anything if not active and we want to hide it completely
  if (!isActive && !styles.container.opacity) {
    return null;
  }
  
  return (
    <View style={styles.absoluteContainer}>
      <View style={[styles.container, !isActive && { opacity: 0.5 }]}>
        <Animated.View
          style={[
            styles.loaderRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: thickness,
              borderColor: theme.primary,
              borderTopColor: theme.secondary,
              transform: [
                { rotate: rotation },
                { scale: scaleAnim }
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.loaderCore,
            {
              width: size / 3,
              height: size / 3,
              borderRadius: size / 6,
              backgroundColor: theme.accent,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCore: {
    position: 'absolute',
  },
});

export default ThemeLoader;