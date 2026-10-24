import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from '../Common/Icons';
import { Global } from '../Common/Global';
import { useRouter } from 'expo-router';
import HShadowButton from '../HOC/HShadowButton';
import { useAppContext } from '../Handlers/GlobalContext';

export default function Register() {
  const router = useRouter();
  const { setRegisteredAccount } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setMessage('Choose a password with at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Your passwords do not match.');
      return;
    }

    setRegisteredAccount({ email: email.trim().toLowerCase(), password });
    setMessage('Account created for this session. You can now log in.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Global.AppTheme.login_background_color}
      />
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <HShadowButton
            accessibilityRole="button"
            accessibilityLabel="Back to login"
            buttonstyle={styles.backButton}
            buttonCallback={() => router.back()}>
            <Icons.FontAwesome5
              name="arrow-left"
              color={Global.AppTheme.login_heading_color}
              size={20}
            />
          </HShadowButton>

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
          <Text style={styles.heading}>Create an account</Text>
          <Text style={styles.subtitle}>
            Join Wayfare and start planning your next trip.
          </Text>

          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={Global.AppTheme.login_placeholder_color}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={value => {
              setEmail(value);
              setMessage('');
            }}
          />

          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 8 characters"
            placeholderTextColor={Global.AppTheme.login_placeholder_color}
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
            value={password}
            onChangeText={value => {
              setPassword(value);
              setMessage('');
            }}
          />

          <Text style={styles.fieldLabel}>Confirm password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            placeholderTextColor={Global.AppTheme.login_placeholder_color}
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
            value={confirmPassword}
            onChangeText={value => {
              setConfirmPassword(value);
              setMessage('');
            }}
          />

          {message ? (
            <Text
              style={[
                styles.message,
                message.startsWith('Account created') && styles.successMessage,
              ]}>
              {message}
            </Text>
          ) : null}
          {message.startsWith('Account created') ? (
            <HShadowButton
              accessibilityRole="button"
              buttonstyle={[
                styles.submitButton,
                { backgroundColor: Global.AppTheme.login_primary_color },
              ]}
              buttonCallback={() => router.back()}>
              <Text style={styles.submitButtonText}>Go to login</Text>
            </HShadowButton>
          ) : (
            <HShadowButton
              accessibilityRole="button"
              buttonstyle={[
                styles.submitButton,
                { backgroundColor: Global.AppTheme.login_primary_color },
              ]}
              buttonCallback={submit}>
              <Text style={styles.submitButtonText}>Create account</Text>
            </HShadowButton>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Global.AppTheme.login_background_color,
  },
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 22,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 22,
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  brandMark: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: Global.AppTheme.login_primary_color,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  heading: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 34,
  },
  fieldLabel: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 18,
  },
  input: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Global.AppTheme.login_border_color,
    backgroundColor: Global.AppTheme.login_surface_color,
    paddingHorizontal: 18,
    color: Global.AppTheme.login_text_color,
    fontSize: 16,
  },
  message: {
    color: Global.AppTheme.error_color,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
  },
  successMessage: {
    color: '#287a43',
  },
  submitButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: Global.AppTheme.login_primary_color,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    paddingHorizontal: 0,
    paddingVertical: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: Global.AppTheme.login_surface_color,
    fontSize: 18,
    fontWeight: '700',
  },
});
