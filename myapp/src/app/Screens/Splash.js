import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router/react-navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Global } from '../Common/Global';
import Icons from '../Common/Icons';
import { normalize } from '../CommonStyle/ComponentFunctions';
import HShadowButton from '../HOC/HShadowButton';

const ThemeColors = [
  { primary_color: '#094485', text_color: '#fff' },
  { primary_color: 'black', text_color: '#fff' },
  { primary_color: '#00008B', text_color: '#fff' },
  { primary_color: '#e54495', text_color: '#fff' },
  { primary_color: 'purple', text_color: '#fff' },
  { primary_color: '#0d910d', text_color: '#fff' },
  { primary_color: '#f70404', text_color: '#fff' },
  { primary_color: '#3489a8', text_color: '#fff' },
  { primary_color: 'grey', text_color: '#fff' },
  { primary_color: '#bab10e', text_color: '#fff' },
  { primary_color: '#9e331e', text_color: '#fff' },
];

export default function Splash(props) {
  const [backHandler, setBackHandler] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/Login');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [refresh, router]);

  useFocusEffect(
    useCallback(() => {
      const handler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          BackHandler.exitApp();
          return true;
        },
      );
      return () => handler.remove();
    }, []),
  );

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem(Global.asyncStorageAppKey);
    } catch (e) {
      // ignore
    }
  };

  const setTheme = async item => {
    const theme = {
      ...Global.AppTheme,
      ...item,
      login_primary_color: item.primary_color,
      login_link_color: item.primary_color,
    };
    Global.AppTheme = theme;
    setRefresh(value => value + 1);

    try {
      const jsonValue = JSON.stringify(theme);
      await AsyncStorage.setItem(Global.asyncStorageThemeKey, jsonValue);
    } catch (e) {
      console.warn('Unable to save selected theme', e);
    }
    await removeValue();
    setBackHandler(false);
  };

  const renderThemeSelector = () => (
    <View style={styles.themeContainer}>
      <Text style={styles.themeLabel}>Choose theme</Text>
      <View style={styles.themeRow}>
        {ThemeColors.map((item, index) => (
          <HShadowButton
            key={index}
            accessibilityRole="button"
            accessibilityLabel={`Choose ${item.primary_color} theme`}
            buttonCallback={() => setTheme(item)}
            buttonstyle={styles.themeButton}>
            <View
              style={[
                styles.themeSwatch,
                { backgroundColor: item.primary_color },
              ]}
            />
          </HShadowButton>
        ))}
      </View>
    </View>
  );

  const renderSocialIcons = () => (
    <View style={styles.socialContainer}>
      {['facebook', 'web', 'linkedin'].map((item, i) => (
        <HShadowButton
          key={i}
          buttonCallback={removeValue}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          buttonstyle={styles.socialButton}
        >
          <MaterialCommunityIcons
            name={item}
            color={Global.AppTheme.login_icon_color}
            size={normalize(15)}
          />
        </HShadowButton>
      ))}
    </View>
  );

  const renderAppLogo = () => (
    <HShadowButton
      buttonCallback={() => setBackHandler(false)}
      buttonstyle={styles.logoButton}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../../assets/images/favicon.png')}
        />
        <Text style={styles.appName}>
          {Global.SplashHeading}
        </Text>
      </View>
    </HShadowButton>
  );

  const renderCompanyInfo = () => (
    <View style={styles.companyContainer}>
      <Text style={styles.fromText}>from</Text>
      <Text style={styles.companyName}>CODENZIC INNOVATIONS LLP</Text>

      {renderSocialIcons()}

      {Platform.OS !== 'ios' && (
        <View style={styles.versionContainer}>
          <Text style={styles.codePushVersion}>{Global.CodePushVersion}</Text>
        </View>
      )}

      <Text style={styles.versionText}>
        {Global.version ? `V ${Global.version}` : null}
      </Text>

      <HShadowButton
        buttonCallback={() => setRefresh(refresh + 1)}
        buttonstyle={[
          styles.refreshButton,
          { backgroundColor: Global.AppTheme.login_primary_color },
        ]}
      >
        <Icons.FontAwesome
          name="refresh"
          color={Global.AppTheme.login_surface_color}
          size={normalize(20)}
        />
        <Text style={styles.refreshText}>Refresh</Text>
      </HShadowButton>
    </View>
  );

  const renderLoadingModal = () => (
    <Modal
      animationType="none"
      transparent={true}
      visible={isLoading}
      onRequestClose={() => BackHandler.exitApp()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ActivityIndicator
            size="large"
            color={Global.AppTheme.login_primary_color}
          />
          <Text style={styles.progressText}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        { backgroundColor: Global.AppTheme.login_background_color },
      ]}
    >
      <StatusBar
        backgroundColor={Global.AppTheme.login_background_color}
        barStyle="dark-content"
      />

      {isLoading && renderLoadingModal()}

      {renderAppLogo()}
      {renderCompanyInfo()}
      {renderThemeSelector()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Global.AppTheme.login_background_color,
    paddingTop: normalize(32),
    paddingBottom: 0,
  },

  modalContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(24),
    backgroundColor: Global.AppTheme.login_overlay_color,
  },
  modalContent: {
    backgroundColor: Global.AppTheme.login_surface_color,
    borderWidth: 1,
    elevation: 5,
    borderColor: Global.AppTheme.login_border_color,
    borderRadius: normalize(20),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    minHeight: Dimensions.get('screen').height * 0.2,
    width: '100%',
    padding: normalize(24),
  },
  progressText: {
    color: Global.AppTheme.login_heading_color,
    marginTop: normalize(14),
    fontSize: normalize(14),
    fontWeight: '600',
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(24),
  },
  logoButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  logo: {
    width: normalize(72),
    height: normalize(72),
    resizeMode: 'contain',
    borderRadius: normalize(22),
    marginBottom: normalize(24),
  },
  appName: {
    color: Global.AppTheme.login_heading_color,
    fontWeight: '700',
    fontSize: normalize(30),
    textAlign: 'center',
  },

  companyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(24),
  },
  fromText: {
    color: Global.AppTheme.login_subtitle_color,
    paddingBottom: normalize(6),
    fontSize: normalize(13),
  },
  companyName: {
    color: Global.AppTheme.login_heading_color,
    fontWeight: '700',
    fontSize: normalize(15),
    textAlign: 'center',
  },
  versionContainer: {
    alignItems: 'center',
  },
  codePushVersion: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: normalize(13),
    paddingTop: normalize(16),
  },
  versionText: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: normalize(11),
    paddingTop: normalize(4),
  },
  refreshButton: {
    flexDirection: 'row',
    minWidth: normalize(120),
    height: normalize(42),
    paddingHorizontal: normalize(18),
    marginTop: normalize(20),
    borderRadius: normalize(14),
    backgroundColor: Global.AppTheme.login_primary_color,
    alignItems: 'center',
    justifyContent: 'center',
    gap: normalize(8),
    paddingVertical: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  refreshText: {
    color: Global.AppTheme.login_surface_color,
    fontSize: normalize(13),
    fontWeight: '700',
  },

  socialContainer: {
    flexDirection: 'row',
    width: normalize(90),
    paddingTop: normalize(18),
    justifyContent: 'space-between',
  },
  socialButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
  },

  themeContainer: {
    width: '100%',
    paddingTop: normalize(20),
    paddingBottom: normalize(16),
    paddingHorizontal: normalize(24),
    backgroundColor: Global.AppTheme.login_surface_color,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Global.AppTheme.login_border_color,
    borderTopLeftRadius: normalize(24),
    borderTopRightRadius: normalize(24),
  },
  themeLabel: {
    paddingBottom: normalize(8),
    fontSize: normalize(15),
    fontWeight: '700',
    color: Global.AppTheme.login_heading_color,
  },
  themeRow: {
    flexDirection: 'row',
    paddingTop: normalize(6),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  themeButton: {
    width: normalize(36),
    height: normalize(36),
    marginRight: normalize(8),
    marginBottom: normalize(6),
    borderRadius: normalize(18),
    borderWidth: 1,
    borderColor: Global.AppTheme.login_border_color,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: Global.AppTheme.login_surface_color,
    elevation: 0,
    shadowOpacity: 0,
  },
  themeSwatch: {
    width: normalize(22),
    height: normalize(22),
    borderRadius: normalize(11),
  },
});