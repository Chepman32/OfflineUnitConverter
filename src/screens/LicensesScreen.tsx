import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../i18n';

export default function LicensesScreen() {
  const theme = useTheme();
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.onSurface }]}>{t('licenses.title','Licenses')}</Text>
      <Text style={[styles.text, { color: theme.onSurface }]}>{t('licenses.note','Third-party licenses and acknowledgments.')}</Text>
      <Text style={[styles.text, { color: theme.onSurface }]}>React Native and related libraries are copyright their respective owners.
      See their repositories for license details.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  text: { color:'#111' },
});
