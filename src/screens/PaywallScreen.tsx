import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { getProducts, requestPurchase, restorePurchases } from '../services/iap';
import { useAppStore } from '../store';
import { t } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';

export default function PaywallScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<{ productId: any; price: string }[]>([]);
  const setPro = useAppStore(s => s.setPro);

  useEffect(() => {
    (async () => {
      try {
        const p = await getProducts(['offlineunit_pro','tip_small','tip_medium','tip_large'] as any);
        setProducts(p);
      } catch {}
    })();
  }, []);

  const buy = async (id: any) => {
    setLoading(true);
    try {
      await requestPurchase(id);
      setPro(true);
      Alert.alert(t('paywall.thanks','Thanks!'), t('paywall.success','Purchase successful'));
    } catch (e: any) {
      Alert.alert('Purchase', e?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const restore = async () => {
    setLoading(true);
    try {
      const res = await restorePurchases();
      if (res.some(r => r.productId === 'offlineunit_pro')) { setPro(true); Alert.alert('Restore', 'Entitlement restored'); }
      else Alert.alert('Restore', 'No purchases found');
    } catch (e: any) { Alert.alert('Restore', e?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.onSurface }]}>{t('paywall.title','Pro')}</Text>
      <Text style={[styles.desc, { color: theme.onSurface }]}>Unlock all features, unlimited history and favorites, advanced themes, and more.</Text>
      <View style={styles.cards}>
        <Pressable style={styles.card} disabled={loading} onPress={() => buy('offlineunit_pro')}>
          <Text style={styles.cardTitle}>{t('paywall.unlock','Unlock Pro')}</Text>
          <Text style={styles.cardPrice}>{products.find(p => p.productId==='offlineunit_pro')?.price || '$'}</Text>
        </Pressable>
        <Pressable style={styles.card} disabled={loading} onPress={() => buy('tip_small')}>
          <Text style={styles.cardTitle}>{t('paywall.tip','Tip')}</Text>
          <Text style={styles.cardPrice}>{products.find(p => p.productId==='tip_small')?.price || '$'}</Text>
        </Pressable>
        <Pressable style={styles.card} disabled={loading} onPress={() => buy('tip_medium')}>
          <Text style={styles.cardTitle}>{t('paywall.tip','Tip')}</Text>
          <Text style={styles.cardPrice}>{products.find(p => p.productId==='tip_medium')?.price || '$'}</Text>
        </Pressable>
        <Pressable style={styles.card} disabled={loading} onPress={() => buy('tip_large')}>
          <Text style={styles.cardTitle}>{t('paywall.tip','Tip')}</Text>
          <Text style={styles.cardPrice}>{products.find(p => p.productId==='tip_large')?.price || '$'}</Text>
        </Pressable>
      </View>
      <Pressable style={styles.restore} onPress={restore} disabled={loading}><Text>{t('paywall.restore','Restore Purchases')}</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  desc: { color:'#555' },
  cards: { flexDirection:'row', gap: 12 },
  card: { flex:1, borderWidth:1, borderColor:'#ddd', borderRadius:12, padding: 16, alignItems:'center' },
  cardTitle: { fontWeight:'700' },
  cardPrice: { marginTop: 6, fontSize: 18 },
  restore: { alignSelf:'flex-start', borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:12, paddingVertical:8 },
});
