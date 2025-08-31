# OfflineUnitConverter

Production-ready, offline-first unit converter for iOS (React Native + TypeScript).

Design and architecture: `docs/SDD.md`.

## Quick Start

Prereqs: Node 20+, Xcode 15+, CocoaPods.

```
corepack enable
yarn install
cd ios && pod install && cd ..
yarn ios   # or yarn android
```

## Tests

```
yarn test --watchman=false
```

## Features

- High precision conversion engine (decimal.js-light fallback)
- Fully offline (MMKV storage), export/import JSON
- Pro unlock via IAP with Keychain-backed entitlements
- Multi-convert view, favorites, history, custom units
- Theming (system/light/dark/OLED), Reduce Motion, haptics
- Reanimated animations + gesture interactions
- i18n with runtime language selection

## Privacy

See `docs/PRIVACY.md` — no data collection, no tracking. Network only for IAP.

## CI

GitHub Actions workflow runs typecheck, lint, and tests.

## Release

1) Configure IAP products: `offlineunit_pro`, `tip_small`, `tip_medium`, `tip_large`
2) Verify purchase/restore in sandbox; entitlement persists across reinstall
3) Update screenshots and metadata; App Privacy: no data collected
4) Build via Fastlane or Xcode and submit to TestFlight/App Store
