import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppProviders from '../index';

export default function RootLayout() {
  const routes = (
    <AppProviders>
      <Stack
        screenOptions={{
          animation: 'none',
          headerShown: false,
        }}
      />
    </AppProviders>
  );

  if (Platform.OS === 'web') {
    return routes;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {routes}
    </GestureHandlerRootView>
  );
}
