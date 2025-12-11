Metryvo — Software Design Document (SDD)

Overview
- Product: Metryvo
- Platform: iOS (primary), React Native (TypeScript), fully offline
- Monetization: In-App Purchase (IAP) non-consumable “Pro” unlock; optional tip jar
- Animations: Extensive React Native Reanimated animations (including animated splash)
- Production-ready: High performance, robust architecture, automated tests, CI/CD ready, compliant with App Store guidelines
- Key differentiators:
  - Entirely offline conversion engine with high precision decimal math
  - Lightning-fast UI, haptics, and rich animations
  - Custom units and multi-convert view
  - Elegant iOS-first design

Table of Contents
1) Goals and Non-Goals
2) Personas and Use Cases
3) Functional Requirements
4) Non-Functional Requirements
5) System Architecture
6) Data Model and Conversion Engine
7) Navigation and Information Architecture
8) Detailed UX/UI and Screens
9) Animations and Motion Design (Reanimated)
10) Monetization and IAP
11) Theming, Design System, and Accessibility
12) Offline Strategy and Storage
13) Localization and Internationalization
14) Security and Privacy
15) Error Handling and Edge Cases
16) Testing Strategy
17) Build, CI/CD, and Release
18) Dependencies and Versions
19) Risks, Constraints, and Mitigations
20) Future Enhancements

1) Goals and Non-Goals
Goals
- Provide a fast, intuitive, and visually delightful unit conversion experience that works 100% offline after initial install.
- Use React Native (TypeScript) with React Native Reanimated for rich, smooth animations.
- Offer a production-grade app that passes App Store review and feels native on iOS.
- Support a large set of unit categories with precise, reliable conversions and configurable rounding.
- Monetize via a one-time “Pro” unlock and optional tip jar.

Non-Goals
- No server backend or required analytics.
- No online-only content. Currency conversions requiring live rates are excluded by default. Users can create custom currency-like units.
- No external authentication or cloud sync (optional export/import only).

2) Personas and Use Cases
Personas
- Student Sam: Needs quick conversions for classes and homework; often offline.
- Builder Bella: On site with spotty network; uses multi-convert and favorites.
- Cook Chris: Uses volume, temperature, and weight conversions; wants custom units.
- Engineer Evan: Needs high precision, scientific units, and keyboard-driven input.

Top Use Cases
- Convert a value between two units quickly.
- See all units in a category update in real-time (multi-convert).
- Save favorite unit pairs and reorder them.
- Create custom units (e.g., local standard measure).
- Access recent history; copy result to clipboard with formatting preferences.
- Unlock Pro features to remove limits and customize the experience.

3) Functional Requirements
Core Conversion
- Categories:
  - Length, Mass/Weight, Temperature, Volume, Area, Speed, Time, Pressure, Energy, Power, Data/Storage (SI and binary), Angle, Frequency, Fuel Efficiency, Force, Torque, Density, Flow, Luminance/Illuminance (optional), Electric units (Voltage, Current, Resistance), Acceleration, Sound level (dB, reference included).
- Unit selection via searchable pickers with synonyms and abbreviations.
- Precise conversion engine supporting scale and offset (handle temperature).
- Configurable precision (decimal places) and rounding mode.
- Swap units with a single gesture or button.
- Multi-convert: compute all units in category at once for given input.

User Data
- Favorites: store frequently used unit pairs with custom labels and color tags.
- History: store past conversions with timestamp; clear or restore.
- Custom Units: users define units relative to a base unit for any category; support scale and offset.

Utilities
- Smart Paste: detect numeric values and unit abbreviations from clipboard; prefill and select likely units.
- Copy settings: specify whether to copy value only, value + unit symbol, or full expression.
- Export/Import: JSON export of favorites, custom units, settings, and history via share sheet.

IAP
- Non-consumable “Pro” unlock: removes limits (e.g., number of favorites/custom units), enables advanced themes, unlimited history, multi-convert for all categories, and additional pro-only categories (optional).
- Tip Jar: 3 price points, purely voluntary.

Settings
- Theme: System, Light, Dark, OLED.
- Precision: global default decimal places per category; override for specific pairs.
- Formatting: thousands separators, decimal separator locale, scientific notation threshold.
- Haptics: on/off; intensity profile control for supported interactions.
- Animations: reduce motion toggle; respects iOS Reduce Motion.
- Language: manually selectable with default to system.
- Data management: clear history, export/import, reset to defaults.
- About & Legal: app version, acknowledgments, licenses, privacy policy.

4) Non-Functional Requirements
- Performance: 60fps animations; input-to-result latency under 16ms for typical conversions; cold start under 2 seconds on mid-range iOS devices.
- Availability: fully offline; IAP purchase/restore requires network but entitlement persists offline.
- Precision: decimal math with up to 34 significant digits; avoids floating point drift.
- Stability: crash rate < 0.5% monthly active users.
- Battery: minimal background activity; no polling or network.
- Accessibility: WCAG AA contrast; Dynamic Type; VoiceOver; Reduce Motion; Switch Control.
- Compatibility: iOS 14+; supports iPhone SE (2nd gen) and later.
- Privacy: no tracking, no third-party analytics by default.

5) System Architecture
App Architecture
- Stack: React Native 0.75+, TypeScript, Hermes enabled
- Navigation: React Navigation v6 (stack + bottom tabs + native stack on iOS)
- State Management: Zustand with slices, immer, and selective persistence to MMKV
- Animations/Gestures: React Native Reanimated 3, React Native Gesture Handler
- Storage:
  - MMKV for settings, favorites, entitlements, feature flags, and small datasets (fast, synchronous)
  - Optional: SQLite only if scale grows (initial version uses MMKV arrays w/ indices)
- Precision Math: decimal.js-light
- IAP: react-native-iap (non-consumables + donations)
- Clipboard: react-native-clipboard/clipboard
- Haptics: react-native-haptic-feedback
- Icons/SVG: react-native-svg + SF Symbols via vector icons
- Localization: i18next + react-i18next
- Utilities: dayjs for time, zod for validation

High-Level Layers
- UI Layer: Screens, Components, Theming, Accessibility
- State Layer: Zustand store slices (conversion, units, favorites, history, settings, iap)
- Domain Layer: Conversion engine (unit definitions, formula), search index, validation
- Services: IAP service, storage service, clipboard service, export/import, haptics
- Platform Layer: Device info, safe area, appearance, reduce motion

6) Data Model and Conversion Engine
Unit Model
- Category: id, name, baseUnitId, description
- Unit: id, categoryId, name, symbol, aliases[], factor, offset, notes
  - For linear conversions between unit u and category base:
    - valueBase = (valueInput + offset_u) × factor_u
    - valueOutput = valueBase / factor_v − offset_v
  - Example Temperature:
    - Base unit = Kelvin
    - Celsius: factor=1, offset=273.15; K = C + 273.15
    - Fahrenheit: factor=5/9, offset=459.67; K = (F + 459.67) × 5/9

- CustomUnit: id, categoryId, name, symbol, factor, offset, createdAt, updatedAt, userNote
- FavoritePair: id, fromUnitId, toUnitId, label?, colorTag?, precision?, lastUsedAt
- HistoryItem: id, inputValue, fromUnitId, toUnitId, resultValue, createdAt, copied?, starred?

Precision and Rounding
- Use decimal.js-light for all calculations.
- Rounding modes supported: round half up, floor, ceil, banker's rounding.
- User-configurable decimals per category; fallback global; maximum 12 decimals (UI limit).

Search Index
- Precompute per unit: name + symbol + aliases -> normalized (lowercase, diacritics removed).
- Fuzzy match (threshold) implemented in JS (simple scoring), no network required.

Unit Coverage (examples, not exhaustive)
- Length: m, km, cm, mm, µm, nm, mi, yd, ft, in, nmi, Å
- Mass: kg, g, mg, µg, t, lb, oz, st
- Temperature: K, °C, °F, °R
- Volume: L, mL, µL, m³, cm³, in³, ft³, gal (US), gal (UK), qt, pt, cup, tbsp, tsp
- Area: m², km², cm², mm², in², ft², yd², acre, hectare
- Speed: m/s, km/h, mph, kn, ft/s
- Time: s, ms, µs, ns, min, h, day, week, month (30d), year (365d) with clear notes on assumptions
- Pressure: Pa, kPa, MPa, bar, atm, torr, psi
- Energy: J, kJ, cal, kcal, Wh, kWh, BTU
- Power: W, kW, hp (metric), hp (mechanical)
- Data: bit, byte, KB, MB, GB, TB, KiB, MiB, GiB, TiB
- Angle: deg, rad, grad
- Frequency: Hz, kHz, MHz, GHz
- Fuel Efficiency: L/100km, km/L, mpg (US), mpg (UK)
- Force: N, kN, lbf, dyn
- Torque: N·m, lbf·ft
- Electrical: V, A, Ω, mAh to Coulombs (optional auxiliary conversions)
- Acceleration: m/s², g (standard gravity)

7) Navigation and Information Architecture
- App Root: Native Stack
  - Splash (animated)
  - Onboarding/Paywall (if applicable)
  - Tabs (Bottom Tabs)
    - Home (Categories)
    - Converter
    - Favorites
    - History
    - Settings
  - Modals (Top-level)
    - Unit Picker (full-screen modal)
    - Paywall
    - Export/Import
    - About & Licenses
    - Custom Unit Editor

Navigation Details
- Bottom tabs use iOS-like large titles in nested stack.
- Deep linking scheme (optional): offlineunit://converter?from=kg&to=lb&value=20 (internal only).

8) Detailed UX/UI and Screens
Design Language
- iOS-centric, Human Interface Guidelines aligned
- Rounded corner radius system: 8, 12, 16
- Spacing scale: 4, 8, 12, 16, 24, 32
- Color themes: neutral base with vibrant accent gradients per category
- Typography: SF Pro Text; follow Dynamic Type; weights regular, medium, semibold
- Iconography: SF Symbols; custom category icons via SVG

8.1 Animated Splash and Launch
- LaunchScreen.storyboard shows static logo and background color (instant display).
- After JS loads, Animated Splash appears:
  - Background gradient sweeps diagonally with a repeating but subtle withTiming loop (respect Reduce Motion).
  - Logo wordmark “Metryvo” letter glyphs are drawn using stroke-dashoffset with Reanimated and react-native-svg; easing with withTiming, cubic-bezier.
  - Category icons orbit lightly around the logo using useSharedValue + withSpring; parallax responding to device tilt (useAnimatedSensor if available).
  - A shimmering “offline” badge pulses with withRepeat.
  - Transition out: logo scales down and morphs into the navbar title using shared transition (Reanimated Shared Element style layout animation), background crossfades to Home.

8.2 Onboarding (Optional)
- Page 1: Quick overview (3 cards) with subtle 3D tilt on scroll.
- Page 2: Offline-first + privacy note.
- Page 3: Pro features highlight + CTA to start free or purchase.
- Skip always available; respects Reduce Motion.
- Animations: snap carousel (Gesture Handler + Reanimated), page indicator dot morphing.

8.3 Home (Categories)
- Header: Search bar with animated “focus bloom” (blur intensifies + slight scale on focus).
- “Recent” row: last used categories, horizontally scrollable with card scale on center.
- Categories grid: 2-column grid of cards:
  - Each card shows icon, name, accent gradient background that subtly drifts.
  - Press down: card squishes (withSpring mass=0.6), shadow deepens; release springs back.
  - Long-press hints favorites or quick start: expands card to show top 3 units as chips, with staggered appearance.
- Pull-to-reveal: Pull down reveals hidden “Tips” drawer using Reanimated scroll events.

8.4 Converter (Primary Screen)
Layout
- Top bar: From Unit selector (left), Swap button (center), To Unit selector (right).
  - Unit selectors show name, symbol, and category color. Tapping opens Unit Picker modal with full-screen searchable list and category tabs.
  - Swap Button: On tap, animated 3D flip of the card stack; haptic medium. Value animates smoothly to swapped result (animated number interpolation).
- Input Area:
  - Large numeric input field with contextual thousand separators.
  - Paste icon appears when clipboard has a numeric string; tapping shows Smart Paste preview bubble.
  - Calculator-like keypad (0-9, ., backspace, +/-) at bottom with large hit targets; keys pop with withSpring and haptic light on press.
- Result Area:
  - Prominent converted result; copy button with small ripple effect; long press to show copy options (value only, with symbol, scientific).
  - Tiny rounding chip (e.g., “6 decimals”) that toggles a bottom sheet for precision settings; sheet uses snap points with spring.
- Category chips (horizontal): Quick switch between categories with an animated underline indicator.
- Multi-Convert CTA:
  - “See all units” button expands to full-screen multi-convert mode with bottom card slide-up animation.

Micro-interactions
- Typing number animates the change in place (value cross-fade or flip animation per digit depending on Reduce Motion).
- Invalid input (e.g., multiple decimal separators) gently shakes the input field.
- Auto-swap suggestion: If user selects same unit for both sides, a playful nudge suggests swapping category or changing a unit.

8.5 Unit Picker (Modal)
- Full-screen modal with sticky search bar, segmented control for categories, and list of units with meta (symbol, short description).
- Search bar expands and reveals recent searches with chip animations.
- Unit rows:
  - Favorite star on right; toggling star animates a bounce.
  - Long-press reveals a quick info card (facts, examples, notes).
- Scroll animations: category header collapses to a compact bar on scroll up; on scroll down, expand with spring.
- Filter by: system vs custom units; only show available in current category.

8.6 Multi-Convert View
- Top: Input value field (mirrors Converter input).
- Body: List of all units in the category; each row shows:
  - Unit symbol/name on left; computed value on right; selection ripple highlighting the target unit if tapped.
  - Swiping a row: options to set as “From” or “To” unit for primary converter.
- Animations: Staggered list entrance (withDelay per index); sticky header compresses on scroll.

8.7 Favorites
- Grid/List toggle of favorite unit pairs.
- Drag-and-drop reorder with Gesture Handler; items lift with elevation and shadow transition.
- Tap to open Converter pre-filled with that pair; subtle shared transition to focus user.

8.8 History
- Reverse chronological list; item shows expression (e.g., “12 km → 7.456 mi”), timestamp, and quick actions:
  - Tap inserts into Converter; swipe left to delete (confirm with haptic).
  - Swipe right to “star” and convert to favorite pair.
- Clear all button with confirmation sheet and confetti-like reverse animation for fun if canceled.

8.9 Custom Units
- List of user-defined units per category; add/edit form with validation.
- Fields: Name, Symbol, Base reference unit (dropdown), Factor, Offset (optional), Notes.
- Preview box calculates example conversions live as you type.
- Error states:
  - Factor must be numeric and non-zero; offset numeric; check duplicates.
- Animations: Input focus highlights; save success checkmark morph.

8.10 Settings
- Sections:
  - Appearance: Theme, Accent color for highlights, Reduce Motion.
  - Precision & Formatting: decimal places per category, rounding mode, separators.
  - Interaction: Haptics, key click sound toggle (if included).
  - Data: export/import, clear history, reset.
  - Language: select locale manually.
  - Pro: status, manage purchase, restore purchases, tip jar.
  - About: version, licenses, acknowledgments, privacy policy.
- Toggles animate with realistic spring; accent gradients subtly move when the page is idle.

8.11 Paywall (Modal and Onboarding)
- Content:
  - Hero animation: the units swirl into the logo; gradient background shifts slowly.
  - Benefits list with animated checkmarks.
  - Pricing card with animated toggle between local currency region displays (if user changes locale).
  - Buttons: Purchase, Restore, Maybe later.
- Post-purchase: confetti burst (particles via Reanimated + SVG), haptic success, subtle modal fade-out.

9) Animations and Motion Design (Reanimated)
Foundational Patterns
- Use shared values and derived values for responsiveness.
- Respect prefers-reduced-motion: disable non-essential motion, use crossfade.
- Use LayoutAnimations for list insertions/reorders/deletions.

Key Animations (Pseudo-code)
- Card press feedback:
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }]}));
  const onPressIn = () => { scale.value = withSpring(0.96, { damping: 15, stiffness: 200 }); };
  const onPressOut = () => { scale.value = withSpring(1); };

- Number flip animation:
  const val = useSharedValue(0);
  const animatedNumber = useDerivedValue(() => withTiming(val.value, { duration: 120 }));
  // Render with Interpolate digits or use animated text props

- Bottom sheet snap:
  const translateY = useSharedValue(SCREEN_HEIGHT);
  // onOpen:
  translateY.value = withSpring(SNAP_POINT, { damping: 20, stiffness: 180 });

- Shared element-ish swap:
  // For swap button, animate rotationY on card container to 180deg while swapping labels mid-way
  const rot = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ rotateY: `${rot.value}deg` }]}));
  const swap = () => {
    rot.value = withTiming(180, { duration: 250 }, (finished) => { if (finished) runOnJS(doSwap)(); rot.value = 0; });
  };

- Parallax on Home grid:
  const sensor = useAnimatedSensor(SensorType.ACCELEROMETER);
  const parallax = useAnimatedStyle(() => ({ transform: [{ translateX: sensor.sensor.value.x * 4 }, { translateY: sensor.sensor.value.y * 4 }] }));

- Confetti:
  // Spawn N particles with random vector using withDecay or timed Bezier paths

Animation Performance
- Use Reanimated 3 worklets for all interpolations. Avoid JS-bridge heavy operations during animations.
- Preload SVG assets. Minimize component re-rendering via memoization and Reanimated props.

10) Monetization and IAP
Products
- Non-consumable: offlineunit_pro
  - Unlocks: unlimited favorites/history/custom units, all categories, advanced themes, multi-convert everywhere, precision tuning per pair, and future pro perks.
- Consumable (tips): tip_small, tip_medium, tip_large (no impact on features).

IAP Flow
- Purchase
  - User taps Buy -> show native purchase sheet via react-native-iap requestPurchase.
  - On success: store entitlement locally:
    - Save transaction + productId + transactionDate + appStoreReceipt snapshot in Keychain (react-native-keychain).
    - Set entitlement flag in MMKV.
  - Offline behavior: entitlement persists; user can use Pro without network.
- Restore Purchases
  - Requires network. On restore success, update Keychain and MMKV.
- Receipts
  - Offline-first: we do not perform server-side validation.
  - Note: For Apple Review, non-consumable unlocks without server validation are acceptable; we store entitlements securely and rely on App Store purchase flow authenticity.

Paywall Triggers
- Accessing Pro-only features.
- Onboarding page.
- Settings > Pro.

Compliance Notes
- No misleading pricing. Localized price strings via react-native-iap getProducts().
- “Restore Purchases” visible and functional without requiring purchase.

11) Theming, Design System, and Accessibility
Themes
- System, Light, Dark, OLED (pure black background, adapted color tokens).
- Accent color per category used for gradients; fallback neutral for accessibility.

Design Tokens
- Colors: primary, surface, surfaceElevated, onSurface, accent, accentGradient
- Elevations: shadow 1/2/3 tuned for iOS UIKit look
- Typography: scales with Dynamic Type; ensure no clipped text at largest sizes.
- Icon sizes: 16, 20, 24, 28, 32

Accessibility
- VoiceOver: meaningful labels, hints for interactive elements, proper traits (button, selected, header).
- Focus order: predictable; modals trap focus correctly.
- Dynamic Type: use scalable text; maintain layout at XXL with scroll.
- Reduce Motion: disable parallax, replace flip with fade, shorten springs.
- Color contrast: ensure AA or better (check gradient foreground text).
- Haptics: optional and configurable.

12) Offline Strategy and Storage
- All unit definitions bundled as JSON in app assets.
- All user data (favorites, history, custom units, settings) stored locally in MMKV.
- Entitlements:
  - Boolean and metadata persisted in MMKV and Keychain (Keychain survives reinstalls better; MMKV for fast read).
- Export/Import: generate JSON with version header; validate via zod; merge or replace strategies.

13) Localization and Internationalization
- Supported locales initially: en, es, de, fr, it, pt-BR, ja, zh-Hans, ru (expandable).
- Localize:
  - Unit names and category names (symbols remain standardized).
  - Settings labels, error messages, Paywall content.
- Locale-specific formatting:
  - Decimal and thousands separators via Intl.NumberFormat.
- Pseudolocalization for testing.

14) Security and Privacy
- No network calls except IAP queries/purchases/restores.
- No analytics/ads SDKs by default.
- Keychain storage for IAP entitlements and receipts.
- Clipboard access only on user action or foreground evaluation with explicit icons and no background scraping.
- Privacy policy: clearly states offline operation, no data collection.

15) Error Handling and Edge Cases
- Input errors:
  - Multiple decimals -> show inline validation text and shake animation.
  - Overflow: if value too large, show “Value too large; try scientific notation” and offer to toggle scientific display.
- Temperature below absolute zero: show warning note; allow displaying negative Kelvin if user explicitly enters, but show educational note (configurable).
- Time units assumptions (months, years): show info tooltip about assumed days.
- Custom units conflicts: Alert if symbol or name duplicated within category.
- IAP failures:
  - Purchase canceled -> non-blocking toast.
  - Network unavailable -> suggest retry later; allow app usage normally.
- MMKV corruption: Fail-safe reinitialize storage and offer to restore from last export (if exists) with a clear info alert.

16) Testing Strategy
Unit Tests (Jest)
- Conversion formulas for all categories, including offset-based conversions.
- Rounding modes and precision rules.
- Search indexing and results.
- Custom unit creation/validation.

Component Tests (React Native Testing Library)
- Converter interactions: input, swap, unit select flows.
- Unit Picker search and selection.
- Settings toggles and persistence.

End-to-End (Detox)
- Onboarding -> Converter -> Purchase -> Unlock -> Favorites -> Export/Import.
- Offline simulation: airplane mode behavior across screens.
- Paywall flows, restore purchase.

Performance Tests
- Interaction latency and frame rate measured in dev builds using React Native Performance tools.
- Scrolling performance of Multi-Convert with long lists.

Accessibility Audits
- VoiceOver navigation path; large text; reduce motion toggles.

CI/CD Gates
- Lint, typecheck, unit tests, E2E on CI (simulator).

17) Build, CI/CD, and Release
- Build:
  - Xcode 15+, iOS SDK latest.
  - Hermes enabled for performance.
- CI:
  - GitHub Actions: install, cache, lint, tsc, jest, detox (simulator).
- Code Quality:
  - ESLint, Prettier, TypeScript strict, husky pre-commit.
- Signing:
  - Fastlane for iOS builds and TestFlight uploads.
- App Store:
  - App Privacy: No data collected (unless future optional analytics).
  - Screenshots: Light and Dark themes; animated aspects captured as static sequences.
  - Review Notes: App works offline; IAP restores available; privacy details.

18) Dependencies and Versions
- react-native: 0.75+
- react-native-reanimated: 3.x
- react-native-gesture-handler: 2.x
- react-navigation/native + native-stack: 6.x
- zustand: 4.x (+ immer middleware)
- react-native-mmkv: 2.x
- decimal.js-light: latest
- react-native-iap: 13.x
- react-native-svg: 14.x
- i18next + react-i18next: latest
- dayjs: latest
- zod: latest
- react-native-haptic-feedback: latest
- clipboard: @react-native-clipboard/clipboard

19) Risks, Constraints, and Mitigations
- IAP without server validation:
  - Mitigation: Rely on App Store purchase authenticity for non-consumables; store entitlements in Keychain; provide clear restore path.
- Precision and performance with large lists:
  - Use decimal.js-light efficiently; memoize computed values; avoid recompute on each keystroke using debounce where appropriate; use Reanimated for animations to keep JS thread free.
- Accessibility complexity with animations:
  - Honor Reduce Motion and Dynamic Type; test VoiceOver paths.
- Data growth with history:
  - Auto-trim history beyond configured max (e.g., 500 entries free, unlimited Pro) with batching.

20) Future Enhancements
- Siri Shortcuts/Intents for conversions (would require native modules).
- Widgets (iOS Home/Lock screen) for quick conversions (requires native targets).
- Optional background rate updater for currency if a network feature is later introduced (out of scope here).
- iCloud Drive backup/restore via Files app picker.

Appendix A: Conversion Engine Implementation Outline
- Base unit per category with clear definitions.
- Unit registry loaded from bundled JSON (versioned).
- API:
  - convert(value: Decimal, fromUnitId: string, toUnitId: string): Decimal
  - format(value: Decimal, options): string
  - getUnitsByCategory(categoryId): Unit[]
  - searchUnits(query): Unit[]
- Temperature specifics:
  - Kelvin base. Define:
    - C: factor=1, offset=273.15
    - F: factor=5/9, offset=459.67
    - R: factor=5/9, offset=0 (Rankine to K: R × 5/9)
- Data units:
  - Distinguish SI (kB=1000 bytes) vs binary (KiB=1024 bytes). Provide separate category tabs or clear labeling.

Appendix B: Data Persistence Schema (MMKV keys)
- settings.theme
- settings.precision.global
- settings.precision.perCategory
- settings.roundingMode
- settings.formatting.separators
- settings.haptics
- settings.reduceMotion
- iap.entitlements.pro
- iap.history (last receipt metadata)
- favorites.list (array of FavoritePair)
- history.list (array of HistoryItem) with capped length
- customUnits.{categoryId} (array of CustomUnit)
- recents.categories (array)
- recents.units (array)

Appendix C: Example Styles and Tokens
- Colors (Light):
  - surface: #FFFFFF
  - surfaceElevated: #F6F7FA
  - onSurface: #1C1C1E
  - accent (length): #4F9EF8 → #2EC7F2 gradient
  - accent (mass): #8A5CF6 → #C35DFD
- Colors (Dark):
  - surface: #0E0F12
  - surfaceElevated: #16181C
  - onSurface: #EDEDED
  - accent gradients darkened 15%

Appendix D: Key UI Components
- CategoryCard
- UnitChip
- UnitRow
- NumericKeypad
- ValueDisplay (animated number)
- SwapButton (3D flip)
- BottomSheet (reanimated + gesture handler)
- PrecisionControl
- PaywallCard
- Tooltip/InfoBubble
- AnimatedGradientBackground

Appendix E: Pseudocode — Smart Paste
- On paste:
  - Extract numeric substring and unit token (using regex).
  - Map token to unit alias table; if match found, prefill fromUnit and set input.
  - If “to” unit is same category favorite, auto-fill toUnit; else leave selection.

Appendix F: Performance Budgets
- Startup: bundle size < 10 MB compressed; no heavy native libs beyond listed.
- JS Thread idle during animation; avoid heavy loops on every keystroke.
- Virtualized lists for Multi-Convert with windowing.

This SDD defines a complete, production-ready plan for Metryvo on iOS with a fully offline architecture, carefully scoped IAP model, detailed UI/UX, and extensive Reanimated-driven animations. It is implementable end-to-end with React Native and JavaScript tools, aligned to Apple’s platform expectations.

