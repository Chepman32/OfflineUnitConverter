import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { getProducts, requestPurchase, restorePurchases } from '../services/iap';
import { useAppStore } from '../store';
import { t } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';

export default function PaywallScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<{ productId: any; price: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('offlineunit_pro');
  const [trialEnabled, setTrialEnabled] = useState(true);
  const setPro = useAppStore(s => s.setPro);

  useEffect(() => {
    (async () => {
      try {
        const p = await getProducts(['offlineunit_pro', 'tip_small', 'tip_medium', 'tip_large'] as any);
        setProducts(p);
      } catch {}
    })();
  }, []);

  const productMap = useMemo(() => {
    const map: Record<string, string> = {};
    products.forEach(p => { map[p.productId] = p.price; });
    return map;
  }, [products]);

  const plans = [
    {
      id: 'offlineunit_pro',
      title: 'Save with Annual',
      subtitle: 'Unlock everything, billed yearly',
      badge: 'Best Offer',
      price: productMap.offlineunit_pro || '$99.99',
      per: 'per year',
      finePrint: 'Billed yearly, cancel anytime',
      highlight: true,
    },
    {
      id: 'tip_small',
      title: 'Start with Weekly',
      subtitle: 'Keep Pro active week by week',
      price: productMap.tip_small || '$5.99',
      per: 'per week',
      finePrint: 'Pay as you go',
    },
  ];

  const buy = async (id: any) => {
    setLoading(true);
    try {
      await requestPurchase(id);
      setPro(true);
      Alert.alert(t('paywall.thanks', 'Thanks!'), t('paywall.success', 'Purchase successful'));
    } catch (e: any) {
      Alert.alert('Purchase', e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const restore = async () => {
    setLoading(true);
    try {
      const res = await restorePurchases();
      if (res.some(r => r.productId === 'offlineunit_pro')) {
        setPro(true);
        Alert.alert('Restore', 'Entitlement restored');
      } else Alert.alert('Restore', 'No purchases found');
    } catch (e: any) {
      Alert.alert('Restore', e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.surface }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.hero}>
        <View style={styles.heroBlurOne} />
        <View style={styles.heroBlurTwo} />
        <Text style={styles.ribbon}>BEST BUSINESS APP</Text>
        <Text style={styles.heroHeading}>For Offline Conversions</Text>
        <Text style={styles.heroStars}>*****</Text>
        <Text style={styles.heroSub}>Create results faster than ever</Text>
      </View>

      <View style={[styles.sectionCard, { borderColor: '#e6e0d8' }]}>
        <View style={styles.trialRow}>
          <View>
            <Text style={styles.trialTitle}>Enable Free Trial</Text>
            <Text style={styles.trialCaption}>We'll remind you when it's over</Text>
          </View>
          <Switch value={trialEnabled} onValueChange={setTrialEnabled} />
        </View>
      </View>

      <View style={styles.planStack}>
        {plans.map(plan => {
          const selected = selectedProduct === plan.id;
          return (
            <Pressable
              key={plan.id}
              style={[
                styles.planCard,
                selected && styles.planCardSelected,
                plan.highlight && styles.planCardHighlight,
              ]}
              disabled={loading}
              onPress={() => setSelectedProduct(plan.id)}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                {plan.badge && <Text style={styles.badge}>{plan.badge}</Text>}
              </View>
              <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
              <View style={styles.planPriceRow}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.planPer}>{plan.per}</Text>
                  {plan.finePrint && <Text style={styles.planPerDim}>{plan.finePrint}</Text>}
                </View>
              </View>
              {selected && <Text style={styles.selectedHint}>Selected</Text>}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.features}>
        <Text style={styles.featureTitle}>What's included</Text>
        {[
          'Unlimited history and favorites',
          'Custom units & CSV export',
          'Advanced themes and copy modes',
          'Offline-first with zero tracking',
        ].map(item => (
          <View key={item} style={styles.featureRow}>
            <Text style={styles.featureDot}>•</Text>
            <Text style={styles.featureText}>{item}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.cta, loading && { opacity: 0.7 }]}
        disabled={loading}
        onPress={() => buy(selectedProduct)}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Continue ></Text>}
      </Pressable>

      <Pressable style={styles.restore} onPress={restore} disabled={loading}>
        <Text style={styles.restoreText}>{t('paywall.restore', 'Restore Purchases')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { padding: 20, paddingTop: 32, paddingBottom: 40, backgroundColor: '#f6f1e8', alignItems: 'center', overflow: 'hidden' },
  heroBlurOne: { position: 'absolute', width: 220, height: 220, borderRadius: 120, backgroundColor: 'rgba(255,255,255,0.6)', top: -40, left: -60 },
  heroBlurTwo: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,0.4)', bottom: -100, right: -80 },
  ribbon: { fontSize: 13, letterSpacing: 1, color: '#444', marginBottom: 6 },
  heroHeading: { fontSize: 22, fontWeight: '700', color: '#2b2b2b' },
  heroStars: { marginTop: 6, fontSize: 18, color: '#f5b300', letterSpacing: 2 },
  heroSub: { marginTop: 8, fontSize: 16, color: '#4b4b4b', textAlign: 'center' },
  sectionCard: { margin: 20, borderWidth: 1, borderRadius: 16, padding: 16, backgroundColor: '#fff' },
  trialRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trialTitle: { fontSize: 18, fontWeight: '700', color: '#1c1c1e' },
  trialCaption: { color: '#6f6f6f', marginTop: 4 },
  planStack: { gap: 12, paddingHorizontal: 20 },
  planCard: { borderWidth: 1, borderColor: '#e4e4e4', borderRadius: 18, padding: 16, backgroundColor: '#fff' },
  planCardSelected: { borderColor: '#1c1c1e', shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  planCardHighlight: { backgroundColor: '#f4f1e6' },
  planHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planTitle: { fontSize: 18, fontWeight: '700', color: '#1c1c1e' },
  planSubtitle: { marginTop: 4, color: '#565656' },
  planPriceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 },
  planPrice: { fontSize: 26, fontWeight: '700', color: '#1c1c1e' },
  planPer: { fontSize: 14, color: '#1c1c1e' },
  planPerDim: { fontSize: 12, color: '#7a7a7a' },
  badge: { backgroundColor: '#000', color: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, overflow: 'hidden' },
  selectedHint: { marginTop: 8, color: '#0f5132', fontWeight: '600' },
  features: { paddingHorizontal: 20, paddingVertical: 18 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: '#1c1c1e', marginBottom: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  featureDot: { marginRight: 8, color: '#1c1c1e', fontSize: 16 },
  featureText: { color: '#4b4b4b', fontSize: 15 },
  cta: { marginHorizontal: 20, marginTop: 8, backgroundColor: '#111', paddingVertical: 16, borderRadius: 18, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  restore: { alignSelf: 'center', marginTop: 12, paddingHorizontal: 12, paddingVertical: 10 },
  restoreText: { color: '#1c1c1e', fontWeight: '600' },
});
