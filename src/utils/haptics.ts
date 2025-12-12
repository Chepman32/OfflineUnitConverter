import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useAppStore } from '../store';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

/**
 * Trigger light haptic feedback if haptics are enabled in settings
 */
export function triggerLightHaptic(): void {
  const haptics = useAppStore.getState().haptics;
  if (haptics) {
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
  }
}

/**
 * Trigger selection haptic feedback if haptics are enabled in settings
 */
export function triggerSelectionHaptic(): void {
  const haptics = useAppStore.getState().haptics;
  if (haptics) {
    ReactNativeHapticFeedback.trigger('selection', hapticOptions);
  }
}

/**
 * Trigger medium haptic feedback if haptics are enabled in settings
 */
export function triggerMediumHaptic(): void {
  const haptics = useAppStore.getState().haptics;
  if (haptics) {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
  }
}
