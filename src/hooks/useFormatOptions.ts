import { useMemo } from 'react';
import { useAppStore } from '../store';
import type { FormatOptions } from '../domain/conversion/types';

export function useFormatOptions(): FormatOptions {
  const decimals = useAppStore(s => s.decimalsGlobal);
  const roundingMode = useAppStore(s => s.roundingMode);
  const formatting = useAppStore(s => s.formatting);
  return useMemo(() => ({ decimals, roundingMode, ...formatting }), [decimals, roundingMode, formatting]);
}

