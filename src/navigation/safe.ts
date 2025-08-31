export function useOptionalNavigation(): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useNavigation } = require('@react-navigation/native');
    return useNavigation();
  } catch {
    return null;
  }
}

