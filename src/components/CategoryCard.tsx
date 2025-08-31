import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import AnimatedPress from './AnimatedPress';

export default function CategoryCard({ title, onPress }: { title: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <AnimatedPress style={[styles.card, { backgroundColor: theme.surface, borderColor: '#e9e9ec' }]} onPress={onPress}>
      <View style={styles.inner}>
        <Text style={[styles.title, { color: theme.onSurface }]}>{title}</Text>
      </View>
    </AnimatedPress>
  );
}

const styles = StyleSheet.create({
  card: { flexBasis: '48%', borderRadius: 14, borderWidth: 1, borderColor: '#e9e9ec', marginBottom: 12, backgroundColor: '#fff' },
  inner: { padding: 16 },
  title: { fontSize: 16, fontWeight: '600' },
});
