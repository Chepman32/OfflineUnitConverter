import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function IconTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vector Icons Test</Text>
      <View style={styles.iconContainer}>
        <Ionicons name="home-outline" size={24} color="#007AFF" />
        <Ionicons name="star-outline" size={24} color="#007AFF" />
        <Ionicons name="settings-outline" size={24} color="#007AFF" />
        <Ionicons name="swap-horizontal-outline" size={24} color="#007AFF" />
        <Ionicons name="time-outline" size={24} color="#007AFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
