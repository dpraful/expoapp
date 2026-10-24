import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "expo-router/react-navigation";
import Icons from "../Common/Icons";
import HShadowButton from "../HOC/HShadowButton";

const CBackHandler = ({ themeColor, title = "Exit App", message = "Do you want to exit the app?" }) => {

  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {

      const backAction = () => {
        setVisible(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();

    }, [])
  );

  return (
    <Modal transparent visible={visible} animationType="fade">

      <View style={styles.overlay}>

        <View style={[styles.exitBox, { backgroundColor: themeColor.card }]}>

          <Icons.MaterialCommunityIcons
            name="exit-to-app"
            size={40}
            color={themeColor.text_color}
          />

          <Text style={[styles.exitTitle, { color: themeColor.text_color }]}>
            {title}
          </Text>

          <Text style={[styles.exitMessage, { color: themeColor.text_color }]}>
            {message}
          </Text>

          <View style={styles.exitButtons}>

            <HShadowButton
              buttonstyle={[styles.cancelButton, { backgroundColor: themeColor.blur_color }]}
              buttonCallback={() => setVisible(false)}
            >
              <Text style={{ color: themeColor.text_color }}>No</Text>
            </HShadowButton>

            <HShadowButton
              buttonstyle={[styles.exitButton, { backgroundColor: themeColor.primary_color }]}
              buttonCallback={() => BackHandler.exitApp()}
            >
              <Text style={{ color: themeColor.text_color }}>Yes</Text>
            </HShadowButton>

          </View>

        </View>

      </View>

    </Modal>
  );
};

export default CBackHandler;

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  exitBox: {
    width: 300,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },

  exitTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  exitMessage: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  exitButtons: {
    flexDirection: "row",
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginRight: 10,
    elevation: 0,
    shadowOpacity: 0,
  },

  exitButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 0,
    shadowOpacity: 0,
  },

});