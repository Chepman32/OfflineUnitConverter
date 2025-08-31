/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { useAppStore } from './src/store';
import React, { useEffect } from 'react';
import { hydrateProFromKeychain } from './src/services/entitlements';
import AnimatedSplash from './src/components/AnimatedSplash';
import ErrorBoundary from './src/components/ErrorBoundary';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const themeMode = useAppStore(s => s.theme);

  return (
    <SafeAreaProvider>
      <ThemeProvider mode={themeMode}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppHydrator>
          <AppContent />
        </AppHydrator>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }] }>
      <ErrorBoundary>
        <AppNavigator />
      </ErrorBoundary>
      <AnimatedSplash />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

function AppHydrator({ children }: { children: React.ReactNode }) {
  const setPro = useAppStore(s => s.setPro);
  useEffect(() => {
    hydrateProFromKeychain().then(val => setPro(val)).catch(() => {});
  }, [setPro]);
  return <>{children}</>;
}
