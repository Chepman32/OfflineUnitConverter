import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import ConverterScreen from '../screens/ConverterScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MultiConvertScreen from '../screens/MultiConvertScreen';
import PaywallScreen from '../screens/PaywallScreen';
import AboutScreen from '../screens/AboutScreen';
import { t } from '../i18n';
import HomeScreen from '../screens/HomeScreen';
import LicensesScreen from '../screens/LicensesScreen';
import CustomUnitsScreen from '../screens/CustomUnitsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { useAppStore } from '../store';

type ScreenKey = 'Home' | 'Converter' | 'Favorites' | 'History' | 'Settings';

export default function AppNavigator() {
  // Try to dynamically require React Navigation if available; otherwise use shim.
  const Nav = useMemo(() => {
    try {
      const { NavigationContainer } = require('@react-navigation/native');
      let Tabs: any;
      try {
        const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
        Tabs = createBottomTabNavigator();
      } catch {
        Tabs = null;
      }
      if (Tabs) {
        const { createNativeStackNavigator } = require('@react-navigation/native-stack');
        const Stack = createNativeStackNavigator();

        // Prefer vector icons if available; fallback to emoji if not installed
        let Ionicons: any = null;
        try {
          Ionicons = require('react-native-vector-icons/Ionicons').default
            || require('react-native-vector-icons/Ionicons');
        } catch {}

        const getIonName = (name: string): string => {
          switch (name) {
            case 'Home': return 'home-outline';
            case 'Converter': return 'swap-horizontal-outline';
            case 'Favorites': return 'star-outline';
            case 'History': return 'time-outline';
            case 'MultiConvert': return 'list-outline';
            case 'Settings': return 'settings-outline';
            case 'Pro': return 'diamond-outline';
            case 'About': return 'information-circle-outline';
            case 'Licenses': return 'document-text-outline';
            case 'CustomUnits': return 'construct-outline';
            default: return 'ellipse-outline';
          }
        };

        const getEmoji = (name: string): string => {
          switch (name) {
            case 'Home': return '🏠';
            case 'Converter': return '🔁';
            case 'Favorites': return '⭐';
            case 'History': return '🕘';
            case 'MultiConvert': return '📋';
            case 'Settings': return '⚙️';
            case 'Pro': return '💎';
            case 'About': return 'ℹ️';
            case 'Licenses': return '📜';
            case 'CustomUnits': return '🧩';
            default: return '⬣';
          }
        };

        const TabsNav = () => (
          <Tabs.Navigator
            screenOptions={({ route }: any) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                Ionicons
                  ? <Ionicons name={getIonName(route.name)} size={size} color={color} />
                  : <Text style={{ fontSize: size, color }} accessibilityLabel={route.name + ' icon'}>{getEmoji(route.name)}</Text>
              ),
            })}
          >
            <Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('tabs.home','Home') }} />
            <Tabs.Screen name="Converter" component={ConverterScreen} options={{ tabBarLabel: t('tabs.converter','Converter') }} />
            <Tabs.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel: t('tabs.favorites','Favorites') }} />
            <Tabs.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: t('tabs.history','History') }} />
            <Tabs.Screen name="MultiConvert" component={MultiConvertScreen} options={{ tabBarLabel: t('tabs.multiConvert','All Units') }} />
            <Tabs.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: t('tabs.settings','Settings') }} />
            <Tabs.Screen name="Pro" component={PaywallScreen} options={{ tabBarLabel: t('tabs.pro','Pro') }} />
            <Tabs.Screen name="About" component={AboutScreen} options={{ tabBarLabel: 'About' }} />
            <Tabs.Screen name="Licenses" component={LicensesScreen} options={{ tabBarLabel: t('licenses.title','Licenses') }} />
            <Tabs.Screen name="CustomUnits" component={CustomUnitsScreen} options={{ tabBarLabel: t('customUnits.title','Custom') }} />
          </Tabs.Navigator>
        );

        const Root = () => {
          const seen = useAppStore(s => s.onboardingSeen);
          return (
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={seen ? 'Main' : 'Onboarding'}>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Main" component={TabsNav} />
              </Stack.Navigator>
            </NavigationContainer>
          );
        };
        return () => <Root />;
      }
      // fallback to a simple stack if bottom-tabs not installed
      const { createNativeStackNavigator } = require('@react-navigation/native-stack');
      const Stack = createNativeStackNavigator();
      const RootStack = () => (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Converter" component={ConverterScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="MultiConvert" component={MultiConvertScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Pro" component={PaywallScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Licenses" component={LicensesScreen} />
            <Stack.Screen name="CustomUnits" component={CustomUnitsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
      return () => <RootStack />;
    } catch {
      return null;
    }
  }, []);

  if (Nav) return <Nav />;

  // Fallback shim: simple top tabs
  const [tab, setTab] = useState<ScreenKey>('Converter');
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {tab === 'Converter' && <ConverterScreen />}
        {tab === 'Favorites' && <FavoritesScreen />}
        {tab === 'History' && <HistoryScreen />}
        {tab === 'Settings' && <SettingsScreen />}
        {tab === 'Home' && (
          <View style={styles.center}><Text>Home (stub)</Text></View>
        )}
      </View>
      <View style={styles.tabbar}>
        {(['Converter','Favorites','History','Settings'] as ScreenKey[]).map(k => (
          <Pressable key={k} onPress={() => setTab(k)} style={[styles.tab, tab===k && styles.tabActive]}>
            <Text style={[styles.tabText, tab===k && styles.tabTextActive]}>{k}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  center: { flex:1, alignItems:'center', justifyContent:'center' },
  tabbar: { flexDirection:'row', borderTopWidth:1, borderColor:'#e5e5ea' },
  tab: { flex:1, paddingVertical:12, alignItems:'center' },
  tabActive: { borderTopWidth:2, borderColor:'#111' },
  tabText: { color:'#666' },
  tabTextActive: { color:'#111', fontWeight:'600' },
});
