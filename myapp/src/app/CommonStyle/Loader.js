import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Modal,
  Animated,
  Easing,
  Text,
  Image
} from "react-native";

import { normalize } from '../CommonStyle/ComponentFunctions';
import { APIURL } from "../Common/apiConstants";

export default function Loader({
  visible = true,
  overlayColor = 'rgba(0,0,0,0.4)',
  loaderColor = 'lightblue',
  size = 50,
  gifSource = {uri:`${APIURL}insurancefile/getCommonFile/image/heartpulse.gif`},
  message = '',
  messageStyle = {},
  animationType = 'fade',
  hasBackground = true,
  borderRadius = 20,
  shadow = true
}) {
  const [rotation] = useState(new Animated.Value(0));
  const [pulse] = useState(new Animated.Value(1));
  const [fade] = useState(new Animated.Value(0));

  // Rotation animation
  useEffect(() => {
    if (!gifSource) { // Only animate if not using a GIF
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    }

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        })
      ])
    ).start();

    // Fade in animation
    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const loaderContent = gifSource ? (
    <Image
      style={[styles.icon_style, { width: normalize(size), height: normalize(size) }]}
      source={gifSource}
    />
  ) : (
    <Animated.View style={[
      styles.defaultLoader, 
      { 
        borderColor: loaderColor,
        transform: [{ rotate: spin }, { scale: pulse }],
        width: normalize(size),
        height: normalize(size),
        borderWidth: normalize(size / 10)
      }
    ]}>
      <View style={[
        styles.innerCircle, 
        { 
          backgroundColor: loaderColor,
          width: normalize(size / 2),
          height: normalize(size / 2)
        }
      ]} />
    </Animated.View>
  );

  return (
    <Modal
      animationType={animationType}
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <Animated.View style={[
        styles.modalContainer,
        { 
          backgroundColor: overlayColor,
          opacity: fade
        }
      ]}>
        <Animated.View style={[
          styles.loaderContainer,
          { 
            backgroundColor: hasBackground ? 'white' : 'transparent',
            borderRadius: normalize(borderRadius),
            transform: [{ scale: pulse }],
            ...(shadow && styles.shadowStyle)
          }
        ]}>
          {loaderContent}
          {message ? (
            <Text style={[styles.messageText, messageStyle]}>
              {message}
            </Text>
          ) : null}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    padding: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon_style: {
    justifyContent: "center",
    alignItems: "center"
  },
  defaultLoader: {
    borderRadius: normalize(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    borderRadius: normalize(100),
  },
  messageText: {
    marginTop: normalize(15),
    fontSize: normalize(14),
    color: '#555',
    textAlign: 'center'
  },
  shadowStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});