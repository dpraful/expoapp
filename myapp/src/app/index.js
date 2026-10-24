import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorBoundary from './Common/ErrorBoundary';
import { AppProvider } from './Handlers/GlobalContext';
import { ResponseComponentProvider } from './Handlers/ResponseComponentContext';

export default function AppProviders({ children }) {

  return (
    <AppProvider>
      <ResponseComponentProvider>
        <View style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </SafeAreaView>
        </View>
      </ResponseComponentProvider>
    </AppProvider>
  );
}