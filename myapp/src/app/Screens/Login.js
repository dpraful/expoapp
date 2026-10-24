import React, { useState } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../CommonStyle/Loader';
import HView from '../HOC/HView';
import { Global } from '../Common/Global';
import CBackHandler from '../CommonStyle/CBackHandler';

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Global.AppTheme.login_background_color}
        barStyle="dark-content"
      />
      <View style={styles.content}>
        <HView
          component="LoginLayout"
          loader={val => (val === undefined ? null : setIsLoading(val))}
        />
        {isLoading && <Loader displaytext={true} />}
      </View>
      <CBackHandler
        title="Exit Wayfare"
        message="Are you sure you want to exit?"
        themeColor={{
          card: Global.AppTheme.login_surface_color,
          text_color: Global.AppTheme.login_heading_color,
          blur_color: Global.AppTheme.login_background_color,
          primary_color: Global.AppTheme.login_primary_color,
        }}
      />
    </SafeAreaView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Global.AppTheme.login_background_color,
  },
  content: {
    flex: 1,
  },
});