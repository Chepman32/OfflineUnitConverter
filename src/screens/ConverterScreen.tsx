import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { convert } from '../domain/conversion/engine';
import { getUnitById, categories } from '../data/units';
import { getDefaultPairForCategory } from '../utils/defaultPairs';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../i18n';
import PrecisionControl from '../components/PrecisionControl';
import NumericKeypad from '../components/NumericKeypad';
import UnitPicker from '../components/UnitPicker';
import { useFormatOptions } from '../hooks/useFormatOptions';
import { useAppStore } from '../store';
import Clipboard from '@react-native-clipboard/clipboard';

export default function ConverterScreen() {
  const fromUnit = useAppStore(s => s.fromUnitId);
  const toUnit = useAppStore(s => s.toUnitId);
  const input = useAppStore(s => s.input);
  const setFrom = useAppStore(s => s.setFrom);
  const setTo = useAppStore(s => s.setTo);
  const setPair = useAppStore(s => s.setPair);
  const setInput = useAppStore(s => s.setInput);
  const swap = useAppStore(s => s.swap);
  const [pickerFor, setPickerFor] = React.useState<'from'|'to'|'category'|null>(null);
  const [showPrecision, setShowPrecision] = React.useState(false);
  const addRecentCategory = useAppStore(s => s.addRecentCategory);
  const addHistory = useAppStore(s => s.addHistory);
  const isPro = useAppStore(s => s.pro);
  const categoryId = getUnitById(fromUnit)?.categoryId ?? 'length';
  const theme = useTheme();

  const fmt = useFormatOptions();
  const result = useMemo(() => {
    try { return convert(input || '0', fromUnit, toUnit, fmt); } catch { return '-'; }
  }, [input, fromUnit, toUnit, fmt]);

  const invalid = useMemo(() => {
    // allow "-" or "-0.5" style, only one dot
    const s = input;
    if (!s) return false;
    if (/^-?$/.test(s)) return false;
    if ((s.match(/\./g) || []).length > 1) return true;
    return isNaN(Number(s));
  }, [input]);

  // Auto-track history when conversion changes
  React.useEffect(() => {
    if (!input || input === '0' || result === '-' || invalid) return;
    
    const timeoutId = setTimeout(() => {
      try {
        addHistory({
          id: String(Date.now()),
          inputValue: input,
          fromUnitId: fromUnit,
          toUnitId: toUnit,
          resultValue: result,
          createdAt: Date.now(),
        }, isPro);
      } catch (error) {
        console.warn('Failed to add history:', error);
      }
    }, 1000); // Debounce for 1 second to avoid spamming history

    return () => clearTimeout(timeoutId);
  }, [input, fromUnit, toUnit, result, invalid, addHistory, isPro]);

  const onKey = (k: string) => {
    const prev = useAppStore.getState().input;
    if (k === '⌫') return setInput(prev.slice(0, -1));
    if (k === '·') return setInput(prev.includes('.') ? prev : prev + '.');
    if (k === '±') return setInput(prev.startsWith('-') ? prev.slice(1) : '-' + prev);
    if (/^\d$/.test(k)) return setInput(prev === '0' ? k : prev + k);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Category Header */}
      <Text style={[styles.categoryHeader, { color: theme.onSurface }]}>
        {categories.find(c => c.id === categoryId)?.name?.toUpperCase() || 'CONVERSION'}
      </Text>

      {/* Main Conversion Display */}
      <View style={[styles.conversionCard, { backgroundColor: theme.surfaceElevated }]}>
        <View style={styles.conversionRow}>
          <View style={styles.valueContainer}>
            <Text style={[styles.inputValue, { color: theme.onSurface }]}>
              {input || '0'}
            </Text>
            <Text style={[styles.unitLabel, { color: theme.onSurface }]}>
              {getUnitById(fromUnit)?.symbol || fromUnit}
            </Text>
          </View>

          {/* Swap Button */}
          <Pressable
            style={styles.swapButton}
            onPress={() => swap()}
            accessibilityRole="button"
            accessibilityLabel="Swap units"
          >
            <Text style={styles.swapIcon}>⇄</Text>
          </Pressable>

          <Pressable
            style={styles.valueContainer}
            onLongPress={() => {
              Alert.alert(
                'Result Options',
                `Value: ${result}\nFrom: ${getUnitById(fromUnit)?.name || fromUnit}\nTo: ${getUnitById(toUnit)?.name || toUnit}`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Copy Value', 
                    onPress: () => {
                      Clipboard.setString(result);
                      Alert.alert('Copied', 'Result copied to clipboard');
                    }
                  },
                  { 
                    text: 'Copy with Unit', 
                    onPress: () => {
                      const unit = getUnitById(toUnit);
                      const text = `${result} ${unit?.symbol || toUnit}`;
                      Clipboard.setString(text);
                      Alert.alert('Copied', 'Result with unit copied to clipboard');
                    }
                  }
                ]
              );
            }}
          >
            <Text style={[styles.resultValue, { color: theme.onSurface }]}>
              {result}
            </Text>
            <Text style={[styles.unitLabel, { color: theme.onSurface }]}>
              {getUnitById(toUnit)?.symbol || toUnit}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesSection}>
        <Pressable
          style={[styles.categoriesButton, { borderColor: '#ddd' }]}
          onPress={() => setPickerFor('category')}
        >
          <Text style={[styles.categoriesText, { color: theme.onSurface }]}>Categories</Text>
        </Pressable>
      </View>

      {/* Category Pills */}
      <ScrollRowCategories
        active={categoryId}
        onSelect={(id) => {
          const pair = getDefaultPairForCategory(id as any);
          setPair(pair[0], pair[1]);
          setInput('0'); // Reset input when category changes
          addRecentCategory(id);
        }}
      />

      {/* Result Section Label */}
      <Text style={[styles.resultSectionLabel, { color: '#666' }]}>Result</Text>

      {/* Numeric Keypad */}
      <View style={styles.keypadContainer}>
        <NumericKeypad onKey={onKey} />
      </View>

      {/* Hidden UI Elements - keeping existing functionality */}
      <View style={{ opacity: 0, position: 'absolute', top: -1000 }}>
        {invalid && (
          <Text style={styles.validation}>{t('errors.invalidNumber','Invalid number format')}</Text>
        )}
      </View>

      {/* Modals and Pickers */}
      <PrecisionControl visible={showPrecision} onClose={() => setShowPrecision(false)} />
      <UnitPicker
        visible={pickerFor === 'from' || pickerFor === 'to'}
        onClose={() => setPickerFor(null)}
        categoryId={categoryId}
        onSelect={(id) => {
          if (pickerFor === 'from') setFrom(id); else setTo(id);
          try { useAppStore.getState().addRecentUnit(id); } catch {}
        }}
      />

      {/* Category Picker Modal */}
      {pickerFor === 'category' && (
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setPickerFor(null)}
        >
          <Pressable 
            style={[styles.categoryModal, { backgroundColor: theme.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: theme.onSurface }]}>Select Category</Text>
            {categories.map(cat => (
              <Pressable
                key={cat.id}
                style={[styles.categoryItem, { borderBottomColor: '#ddd' }]}
                onPress={() => {
                  const pair = getDefaultPairForCategory(cat.id as any);
                  setPair(pair[0], pair[1]);
                  setInput('0'); // Reset input when category changes
                  addRecentCategory(cat.id);
                  setPickerFor(null);
                }}
              >
                <Text style={[styles.categoryItemText, { color: theme.onSurface }]}>{cat.name}</Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setPickerFor(null)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

function ScrollRowCategories({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <View style={styles.categoryPills}>
      {categories.slice(0, 8).map(cat => (
        <Pressable 
          key={cat.id} 
          accessibilityRole="button" 
          accessibilityLabel={cat.name} 
          onPress={() => onSelect(cat.id)} 
          style={[
            styles.categoryPill,
            active === cat.id && styles.categoryPillActive
          ]}
        >
          <Text style={[
            styles.categoryPillText,
            active === cat.id && styles.categoryPillTextActive
          ]}>
            {cat.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingBottom: 80 
  },
  
  // Category Header
  categoryHeader: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 1,
  },
  
  // Main Conversion Card
  conversionCard: {
    borderRadius: 20,
    padding: 30,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  valueContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  inputValue: {
    fontSize: 36,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  resultValue: {
    fontSize: 36,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  unitLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  swapButton: {
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  
  swapIcon: {
    fontSize: 24,
    color: '#666',
  },
  
  // Categories Section
  categoriesSection: {
    marginBottom: 20,
  },
  
  categoriesButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  
  categoriesText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Category Pills
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
  },
  
  categoryPill: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  
  categoryPillActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  
  categoryPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  
  categoryPillTextActive: {
    color: '#fff',
  },
  
  // Result Section
  resultSectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
    color: '#666',
  },
  
  // Numeric Keypad Container
  keypadContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  categoryModal: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 20,
    padding: 20,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  
  categoryItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Legacy styles for hidden elements
  validation: { 
    color:'#ff3b30', 
    marginTop: -6 
  },
});
