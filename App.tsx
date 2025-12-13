/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { useAppStore } from './src/store';
import React, { useEffect } from 'react';
import AnimatedSplash from './src/components/AnimatedSplash';
import ErrorBoundary from './src/components/ErrorBoundary';
import { getDeviceLanguage } from './src/i18n';

function App() {
  const themeMode = useAppStore(s => s.theme);
  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);
  const onboardingSeen = useAppStore(s => s.onboardingSeen);

  useEffect(() => {
    // Auto-detect device language on first launch
    if (!onboardingSeen && !language) {
      const deviceLang = getDeviceLanguage();
      setLanguage(deviceLang);
    }
  }, [onboardingSeen, language, setLanguage]);

  return (
    <SafeAreaProvider>
      <ThemeProvider mode={themeMode}>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.surface}
      />
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
