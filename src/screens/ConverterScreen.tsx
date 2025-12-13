import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { convert } from '../domain/conversion/engine';
import { getUnitById, categories, getUnitsByCategory } from '../data/units';
import { getDefaultPairForCategory } from '../utils/defaultPairs';
import { useTheme } from '../theme/ThemeProvider';
import PrecisionControl from '../components/PrecisionControl';
import NumericKeypad from '../components/NumericKeypad';
import UnitPicker from '../components/UnitPicker';
import { useFormatOptions } from '../hooks/useFormatOptions';
import { useAppStore } from '../store';
import Clipboard from '@react-native-clipboard/clipboard';
import { MenuView } from '@react-native-menu/menu';
import { triggerLightHaptic, triggerSelectionHaptic } from '../utils/haptics';

export default function ConverterScreen() {
  const { t } = useTranslation();
  const fromUnit = useAppStore(s => s.fromUnitId);
  const toUnit = useAppStore(s => s.toUnitId);
  const input = useAppStore(s => s.input);
  const setFrom = useAppStore(s => s.setFrom);
  const setTo = useAppStore(s => s.setTo);
  const setPair = useAppStore(s => s.setPair);
  const setInput = useAppStore(s => s.setInput);
  const swap = useAppStore(s => s.swap);
  const [pickerFor, setPickerFor] = React.useState<
    'from' | 'to' | 'category' | null
  >(null);
  const [showPrecision, setShowPrecision] = React.useState(false);
  const addRecentCategory = useAppStore(s => s.addRecentCategory);
  const addHistory = useAppStore(s => s.addHistory);
  const favorites = useAppStore(s => s.favorites);
  const addFavorite = useAppStore(s => s.addFavorite);
  const removeFavorite = useAppStore(s => s.removeFavorite);
  const recentsUnits = useAppStore(s => s.recentsUnits);
  const addRecentUnit = useAppStore(s => s.addRecentUnit);
  const copyMode = useAppStore(s => s.copyMode);
  const categoryId = getUnitById(fromUnit)?.categoryId ?? 'length';
  const theme = useTheme();

  // Build menu for unit selection
  const buildUnitMenu = React.useCallback(
    (forSide: 'from' | 'to') => {
      const currentUnitId = forSide === 'from' ? fromUnit : toUnit;
      const categoryUnits = getUnitsByCategory(categoryId);

      // Filter recent units by current category, take first 6
      const recentInCategory = recentsUnits
        .map(id => getUnitById(id))
        .filter(u => u && u.categoryId === categoryId)
        .slice(0, 6);

      const recentIds = new Set(recentInCategory.map(u => u!.id));
      const otherUnits = categoryUnits.filter(u => !recentIds.has(u.id));

      const menuItems = [];

      // Recent section with displayInline
      if (recentInCategory.length > 0) {
        menuItems.push({
          id: '__recent',
          title: t('common.recent'),
          displayInline: true,
          subactions: recentInCategory.map(unit => ({
            id: unit!.id,
            title: unit!.name,
            subtitle: unit!.symbol,
            state: unit!.id === currentUnitId ? 'on' : undefined,
          })),
        });
      }

      // All units section with displayInline
      menuItems.push({
        id: '__all',
        title: t('common.allUnits'),
        displayInline: true,
        subactions: otherUnits.map(unit => ({
          id: unit.id,
          title: unit.name,
          subtitle: unit.symbol,
          state: unit.id === currentUnitId ? 'on' : undefined,
        })),
      });

      return menuItems;
    },
    [fromUnit, toUnit, categoryId, recentsUnits, t],
  );

  // Handle unit selection from menu
  const handleUnitSelection = React.useCallback(
    (unitId: string, forSide: 'from' | 'to') => {
      triggerSelectionHaptic();

      if (forSide === 'from') {
        setFrom(unitId);
      } else {
        setTo(unitId);
      }

      addRecentUnit(unitId);
    },
    [setFrom, setTo, addRecentUnit],
  );

  // Validate that fromUnit and toUnit exist, otherwise reset to defaults
  React.useEffect(() => {
    const from = getUnitById(fromUnit);
    const to = getUnitById(toUnit);
    if (!from || !to) {
      console.warn('Invalid unit detected, resetting to defaults:', {
        fromUnit,
        toUnit,
      });
      const [defaultFrom, defaultTo] = getDefaultPairForCategory(
        categoryId as any,
      );
      setPair(defaultFrom, defaultTo);
    }
  }, [fromUnit, toUnit, categoryId, setPair]);

  const fmt = useFormatOptions();
  const result = useMemo(() => {
    try {
      return convert(input || '0', fromUnit, toUnit, fmt);
    } catch {
      return '-';
    }
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
        });
      } catch (error) {
        console.warn('Failed to add history:', error);
      }
    }, 1000); // Debounce for 1 second to avoid spamming history

    return () => clearTimeout(timeoutId);
  }, [input, fromUnit, toUnit, result, invalid, addHistory]);

  const onKey = (k: string) => {
    const prev = useAppStore.getState().input;
    if (k === '⌫') return setInput(prev.slice(0, -1));
    if (k === '·') return setInput(prev.includes('.') ? prev : prev + '.');
    if (k === '±')
      return setInput(prev.startsWith('-') ? prev.slice(1) : '-' + prev);
    if (/^\d$/.test(k)) return setInput(prev === '0' ? k : prev + k);
  };

  const favMatch = favorites.find(
    f => f.fromUnitId === fromUnit && f.toUnitId === toUnit,
  );
  const toggleFavorite = () => {
    triggerLightHaptic();
    if (favMatch) {
      removeFavorite(favMatch.id);
      return;
    }
    const from = getUnitById(fromUnit);
    const to = getUnitById(toUnit);
    const id = `${fromUnit}-${toUnit}`;
    const label = `${input || '0'} ${from?.symbol || fromUnit} → ${result} ${
      to?.symbol || toUnit
    }`;
    addFavorite({
      id,
      fromUnitId: fromUnit,
      toUnitId: toUnit,
      label,
      lastUsedAt: Date.now(),
    });
  };

  const copyValue = React.useCallback(
    (value: string, side: 'from' | 'to') => {
      const unitId = side === 'from' ? fromUnit : toUnit;
      const unit = getUnitById(unitId);
      const unitSymbol = unit?.symbol || unitId;

      let textToCopy = value;
      let message =
        side === 'from'
          ? t('converter.inputCopied')
          : t('converter.resultCopied');

      if (copyMode === 'value_unit') {
        textToCopy = `${value} ${unitSymbol}`;
        message =
          side === 'from'
            ? t('converter.inputWithUnitCopied')
            : t('converter.resultWithUnitCopied');
      } else if (copyMode === 'expression') {
        const fromUnitObj = getUnitById(fromUnit);
        const toUnitObj = getUnitById(toUnit);
        const fromSymbol = fromUnitObj?.symbol || fromUnit;
        const toSymbol = toUnitObj?.symbol || toUnit;
        textToCopy = `${input || '0'} ${fromSymbol} = ${result} ${toSymbol}`;
        message = t('converter.expressionCopied');
      }

      Clipboard.setString(textToCopy);
      triggerLightHaptic();
      Alert.alert(t('common.copied'), message);
    },
    [copyMode, fromUnit, toUnit, input, result, t],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Category Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.categoryHeader, { color: theme.onSurface }]}>
            {t(
              `categories.${categoryId}`,
              categories.find(c => c.id === categoryId)?.name || 'CONVERSION',
            ).toUpperCase()}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('converter.toggleFavorite')}
            onPress={toggleFavorite}
            style={styles.starBtn}
          >
            <Text
              style={[
                styles.starIcon,
                { color: favMatch ? '#f5b300' : '#999' },
              ]}
            >
              {favMatch ? '★' : '☆'}
            </Text>
          </Pressable>
        </View>

        {/* Main Conversion Display */}
        <View
          style={[
            styles.conversionCard,
            { backgroundColor: theme.surfaceElevated },
          ]}
        >
          <View style={styles.conversionRow}>
            <View style={styles.valueContainer}>
              <Pressable
                onPress={() => copyValue(input || '0', 'from')}
                hitSlop={10}
              >
                <Text
                  style={[styles.inputValue, { color: theme.onSurface }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {input || '0'}
                </Text>
              </Pressable>
              <MenuView
                title={t('unitPicker.selectFromUnit')}
                actions={buildUnitMenu('from')}
                onPressAction={({ nativeEvent }) => {
                  handleUnitSelection(nativeEvent.event, 'from');
                }}
                shouldOpenOnLongPress={false}
              >
                <Pressable onPress={() => triggerLightHaptic()}>
                  <Text style={[styles.unitLabel, { color: theme.onSurface }]}>
                    {getUnitById(fromUnit)?.symbol || fromUnit}
                  </Text>
                </Pressable>
              </MenuView>
            </View>

            {/* Swap Button */}
            <Pressable
              style={styles.swapButton}
              onPress={() => {
                triggerLightHaptic();
                swap();
              }}
              accessibilityRole="button"
              accessibilityLabel={t('converter.swapUnits')}
            >
              <Text style={styles.swapIcon}>⇄</Text>
            </Pressable>

            <View style={styles.valueContainer}>
              <Pressable
                onPress={() => copyValue(result, 'to')}
                hitSlop={10}
                onLongPress={() => {
                  Alert.alert(
                    t('converter.resultOptions'),
                    `${t('common.value')}: ${result}\n${t('common.from')}: ${
                      getUnitById(fromUnit)?.name || fromUnit
                    }\n${t('common.to')}: ${
                      getUnitById(toUnit)?.name || toUnit
                    }`,
                    [
                      { text: t('common.cancel'), style: 'cancel' },
                      {
                        text: t('converter.copyValue'),
                        onPress: () => {
                          Clipboard.setString(result);
                          Alert.alert(
                            t('common.copied'),
                            t('converter.resultCopied'),
                          );
                        },
                      },
                      {
                        text: t('converter.copyWithUnit'),
                        onPress: () => {
                          const unit = getUnitById(toUnit);
                          const text = `${result} ${unit?.symbol || toUnit}`;
                          Clipboard.setString(text);
                          Alert.alert(
                            t('common.copied'),
                            t('converter.resultWithUnitCopied'),
                          );
                        },
                      },
                    ],
                  );
                }}
              >
                <Text
                  style={[styles.resultValue, { color: theme.onSurface }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {result}
                </Text>
              </Pressable>
              <MenuView
                title={t('unitPicker.selectToUnit')}
                actions={buildUnitMenu('to')}
                onPressAction={({ nativeEvent }) => {
                  handleUnitSelection(nativeEvent.event, 'to');
                }}
                shouldOpenOnLongPress={false}
              >
                <Pressable onPress={() => triggerLightHaptic()}>
                  <Text style={[styles.unitLabel, { color: theme.onSurface }]}>
                    {getUnitById(toUnit)?.symbol || toUnit}
                  </Text>
                </Pressable>
              </MenuView>
            </View>
          </View>
        </View>

        {/* Category Pills - Horizontal Scroll */}
        <ScrollRowCategories
          active={categoryId}
          onSelect={id => {
            const pair = getDefaultPairForCategory(id as any);
            setPair(pair[0], pair[1]);
            setInput('0');
            addRecentCategory(id);
          }}
        />

        {/* Numeric Keypad */}
        <View style={styles.keypadContainer}>
          <NumericKeypad onKey={onKey} />
        </View>
      </ScrollView>

      {/* Hidden UI Elements - keeping existing functionality */}
      <View style={{ opacity: 0, position: 'absolute', top: -1000 }}>
        {invalid && (
          <Text style={styles.validation}>
            {t('errors.invalidNumber', 'Invalid number format')}
          </Text>
        )}
      </View>

      {/* Modals and Pickers */}
      <PrecisionControl
        visible={showPrecision}
        onClose={() => setShowPrecision(false)}
      />
      <UnitPicker
        visible={pickerFor === 'from' || pickerFor === 'to'}
        onClose={() => setPickerFor(null)}
        categoryId={categoryId}
        onSelect={id => {
          if (pickerFor === 'from') setFrom(id);
          else setTo(id);
          try {
            useAppStore.getState().addRecentUnit(id);
          } catch {}
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
            onPress={e => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: theme.onSurface }]}>
              {t('unitPicker.selectCategory')}
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  style={[styles.categoryItem, { borderBottomColor: '#ddd' }]}
                  onPress={() => {
                    triggerLightHaptic();
                    const pair = getDefaultPairForCategory(cat.id as any);
                    setPair(pair[0], pair[1]);
                    setInput('0');
                    addRecentCategory(cat.id);
                    setPickerFor(null);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      { color: theme.onSurface },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setPickerFor(null)}
            >
              <Text style={styles.modalCloseText}>{t('common.close')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

function ScrollRowCategories({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryPillsScroll}
      style={styles.categoryPillsContainer}
    >
      {categories.map(cat => (
        <Pressable
          key={cat.id}
          accessibilityRole="button"
          accessibilityLabel={t(`categories.${cat.id}`, cat.name)}
          onPress={() => {
            triggerLightHaptic();
            onSelect(cat.id);
          }}
          style={[
            styles.categoryPill,
            active === cat.id && styles.categoryPillActive,
          ]}
        >
          <Text
            style={[
              styles.categoryPillText,
              active === cat.id && styles.categoryPillTextActive,
            ]}
          >
            {t(`categories.${cat.id}`, cat.name)}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerRow: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  // Category Header
  categoryHeader: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  starBtn: { position: 'absolute', right: 0, padding: 6 },
  starIcon: { fontSize: 24 },

  // Main Conversion Card
  conversionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 6,
  },

  resultValue: {
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 6,
  },

  unitLabel: {
    fontSize: 40,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 12,
  },

  swapButton: {
    marginHorizontal: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },

  swapIcon: {
    fontSize: 20,
    color: '#666',
  },

  // Categories Section
  categoriesSection: {
    marginBottom: 16,
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
  categoryPillsContainer: {
    marginBottom: 0,
    marginHorizontal: -20,
  },

  categoryPillsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },

  categoryPill: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },

  categoryPillActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },

  categoryPillText: {
    fontSize: 13,
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
    alignItems: 'center',
    marginTop: 20,
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
    color: '#ff3b30',
    marginTop: -6,
  },
});
