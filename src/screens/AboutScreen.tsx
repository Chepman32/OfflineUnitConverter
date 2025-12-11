import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function AboutScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.onSurface }]}>Metryvo</Text>
      <Text style={[styles.subtitle, { color: theme.onSurface }]}>Version 0.1.0 (dev)</Text>
      <Text style={[styles.text, { color: theme.onSurface }]}>Fully offline unit conversions with high precision.
      No analytics, no tracking. See docs/SDD.md for architecture.
      </Text>
      <Text style={styles.link} onPress={() => Linking.openURL('https://reactnative.dev')}>Built with React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight:'700' },
  subtitle: { color:'#666' },
  text: { color:'#111' },
  link: { color:'#007aff' },
});
