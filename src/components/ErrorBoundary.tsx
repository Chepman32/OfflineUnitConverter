import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any): State { return { hasError: true, error }; }
  componentDidCatch(error: any, info: any) { /* noop: could log to file */ }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.desc}>{String(this.state.error || '')}</Text>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={() => this.setState({ hasError: false, error: undefined })}>
            <Text style={styles.btnText}>Dismiss</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children as any;
  }
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', padding: 24 },
  title: { fontSize: 18, fontWeight:'700', marginBottom: 8 },
  desc: { color:'#555', marginBottom: 12, textAlign:'center' },
  btn: { backgroundColor:'#111', paddingHorizontal:12, paddingVertical:10, borderRadius:8 },
  btnText: { color:'#fff', fontWeight:'600' },
});

