import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useAppStore } from '../store';

export function useReduceMotion(): boolean {
  const pref = useAppStore(s => s.reduceMotion);
  const [system, setSystem] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(v => { if (mounted) setSystem(!!v); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setSystem as any);
    return () => { mounted = false; (sub as any)?.remove?.(); };
  }, []);

  return pref || system;
}

