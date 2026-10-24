import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  TextInput,
} from 'react-native';
import { Global } from '../Common/Global';
import Icons from '../Common/Icons';
import { BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import HShadowButton from '../HOC/HShadowButton';
import { useAppContext } from '../Handlers/GlobalContext';
import Loader from '../CommonStyle/Loader';

export default function LoginLayout() {
  const clearing = useRef(null);
  const loginTimeout = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const router = useRouter()
  const { registeredAccount } = useAppContext();

  useEffect(() => {
    return () => {
      if (loginTimeout.current) {
        clearTimeout(loginTimeout.current);
        loginTimeout.current = null;
      }
    };
  }, []);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(30))[0];
  const inputTranslateX = useState(new Animated.Value(-50))[0];
  const alertAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Sequential animation for inputs
    Animated.stagger(200, [
      Animated.timing(inputTranslateX, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, inputTranslateX, translateY]);

  // Alert animation
  useEffect(() => {
    if (showAlert) {
      Animated.timing(alertAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showAlert, alertAnim]);

  const clearAlert = () => {
    Animated.timing(alertAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowAlert(false));
  };

  const handleBack = useCallback(() => {
    if (loginTimeout.current) {
      clearTimeout(loginTimeout.current);
      loginTimeout.current = null;
    }
    setIsLoading(false);
    router.back();
    return true;
  }, [router]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );
    return () => backHandler.remove();
  }, [handleBack]);

  const validateLogin = () => {
    if (isLoading || loginTimeout.current) {
      return;
    }

    const email = (registeredAccount?.email || username).trim();
    let message = '';

    if (!email) {
      message = 'Enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message = 'Enter a valid email address';
    } else if (!password.trim()) {
      message = 'Enter your password';
    } else if (
      registeredAccount &&
      (registeredAccount.email !== email.toLowerCase() ||
        registeredAccount.password !== password)
    ) {
      message = 'Email or password does not match the account created this session.';
    } else {
      setIsLoading(true);
      loginTimeout.current = setTimeout(() => {
        loginTimeout.current = null;
        setIsLoading(false);
        router.navigate('/Dashboard');
      }, 500);
    }

    setToastMsg(message);
    setShowAlert(Boolean(message));
    if (message) {
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Global.AppTheme.login_background_color}
      />
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Animated.View
          style={[
            styles.formContainer,
            { opacity: fadeAnim, transform: [{ translateY }] },
          ]}>
          <View
            style={[
              styles.brandMark,
              { backgroundColor: Global.AppTheme.login_primary_color },
            ]}>
            <Icons.FontAwesome5
              name="route"
              color={Global.AppTheme.login_surface_color}
              size={32}
            />
          </View>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Log in to plan a trip and follow your route turn by turn.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Global.AppTheme.login_placeholder_color}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                value={registeredAccount?.email ?? username}
                editable={!registeredAccount}
                onChangeText={setUsername}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputView}>
              <TextInput
                ref={clearing}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={Global.AppTheme.login_placeholder_color}
                secureTextEntry={secureText}
                autoCapitalize="none"
                textContentType="password"
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={validateLogin}
              />
              <HShadowButton
                accessibilityRole="button"
                accessibilityLabel={secureText ? 'Show password' : 'Hide password'}
                buttonCallback={() => setSecureText(!secureText)}
                buttonstyle={styles.eyeButton}>
                <Icons.FontAwesome
                  name={secureText ? 'eye' : 'eye-slash'}
                  color={Global.AppTheme.login_icon_color}
                  size={20}
                />
              </HShadowButton>
            </View>
            <HShadowButton
              buttonstyle={styles.forgotPasswordContainer}
              buttonCallback={() => router.navigate('/forgot-password')}>
              <Text
                style={[
                  styles.forgotPasswordText,
                  { color: Global.AppTheme.login_link_color },
                ]}>
                Forgot password?
              </Text>
            </HShadowButton>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <HShadowButton
          accessibilityRole="button"
          buttonstyle={[
            styles.loginButton,
            { backgroundColor: Global.AppTheme.login_primary_color },
          ]}
          buttonCallback={validateLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </HShadowButton>
        <View style={styles.createAccountRow}>
          <Text style={styles.createAccountPrompt}>New to Wayfare? </Text>
          <HShadowButton
            accessibilityRole="button"
            buttonstyle={styles.createAccountButton}
            buttonCallback={() => router.navigate('/Register')}>
            <Text style={styles.createAccountLink}>Create an account</Text>
          </HShadowButton>
        </View>
      </View>

      {showAlert && (
        <Animated.View style={[styles.alertContainer, { opacity: alertAnim }]}>
          <View style={styles.alertContent}>
            <Icons.FontAwesome
              name="exclamation-circle"
              color={Global.AppTheme.error_color}
              size={16}
            />
            <Text numberOfLines={2} style={styles.alertText}>
              {toastMsg}
            </Text>
            <HShadowButton
              buttonstyle={styles.alertCloseButton}
              buttonCallback={clearAlert}>
              <Icons.FontAwesome
                name="times"
                color={Global.AppTheme.login_icon_color}
                size={14}
              />
            </HShadowButton>
          </View>
        </Animated.View>
      )}
      {isLoading && (
        <Loader
          visible={isLoading}
          message="Signing in..."
          onRequestClose={handleBack}
        />
      )}
    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Global.AppTheme.login_background_color,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
    width: '100%',
  },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Global.AppTheme.login_primary_color,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  heading: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  loginButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Global.AppTheme.login_primary_color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: Global.AppTheme.login_surface_color,
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    backgroundColor: Global.AppTheme.login_surface_color,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Global.AppTheme.login_border_color,
  },
  createAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  createAccountPrompt: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 14,
  },
  createAccountLink: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 14,
    fontWeight: '700',
  },
  createAccountButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 14,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  forgotPasswordText: {
    color: Global.AppTheme.login_link_color,
    fontSize: 14,
    fontWeight: '600',
  },
  alertContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 90,
    left: 16,
    right: 16,
    backgroundColor: Global.AppTheme.login_surface_color,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Global.AppTheme.error_color,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    color: Global.AppTheme.login_alert_text_color,
    fontSize: 13,
    marginLeft: 10,
    marginRight: 10,
  },
  inputView: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Global.AppTheme.login_surface_color,
    borderWidth: 1,
    borderColor: Global.AppTheme.login_border_color,
    paddingLeft: 14,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: '100%',
    flex: 1,
    fontSize: 15,
    color: Global.AppTheme.login_text_color,
    paddingHorizontal: 0,
  },
  eyeButton: {
    minWidth: 32,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  alertCloseButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
});
