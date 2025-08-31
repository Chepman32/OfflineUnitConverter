// Mock Reanimated to avoid ESM import issues in Jest environment
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
// Silence the warning: Animated: `useNativeDriver` was not specified.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

