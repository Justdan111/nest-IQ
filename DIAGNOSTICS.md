# NestIQ — Production Readiness Diagnostics

Date: 2026-05-22
Scanned root: `/Users/danemmanuel/Documents/nestiq/nestiq`
Stack verified: Expo SDK 54, React Native 0.81.5, React 19.1, expo-router 6, NativeWind 4.2, Reanimated 4.1.

---

## TL;DR

The app has a strong UI foundation: every tab and the full auth/onboarding flow renders, the design system is wired up with full light/dark theming, and the major animated components (circular slider, bar chart, bottom sheets, slide indicator) work. **But it is not production ready.** Roughly half the spec'd screens are missing (Add Device wizard, Device Control variants, Room Detail, Away Mode, Profile Edit), state isn't shared across screens (every call to `useDevices` / `useAppState` creates a fresh copy), there's no auth or persistence, several "Add New" / "See All" / bell buttons are dead, and there is one real TypeScript error plus image assets totalling ~5 MB that need optimization before shipping.

A focused 2–3 day pass on the **High-priority** section below should get the app to a credible production-quality demo. Real backend, persistence, and store submission are separate, larger workstreams.

---

## 1. What you've built ✅

### Screens (15 of ~21 spec'd routes)
| Route | Status | Notes |
|---|---|---|
| [app/index.tsx](app/index.tsx) | ✅ | Redirects to onboarding |
| [app/onboarding.tsx](app/onboarding.tsx) | ✅ | 3 slides, paging, dot indicator, FadeInRight, scrim gradients |
| [app/(auth)/welcome.tsx](app/(auth)/welcome.tsx) | ✅ | Brand lockup, gradient over BG image, social row |
| [app/(auth)/sign-in.tsx](app/(auth)/sign-in.tsx) | ✅ | UI only — no validation, no real auth |
| [app/(auth)/sign-up.tsx](app/(auth)/sign-up.tsx) | ✅ | Includes Congrats bottom sheet (icon, not Lottie) |
| [app/(auth)/home-setup.tsx](app/(auth)/home-setup.tsx) | ✅ | Extra screen, not in spec — nice addition |
| [app/(auth)/home-select.tsx](app/(auth)/home-select.tsx) | ✅ | Extra screen, not in spec |
| [app/(tabs)/index.tsx](app/(tabs)/index.tsx) | ✅ | Header, rooms grid, frequently-used list |
| [app/(tabs)/device.tsx](app/(tabs)/device.tsx) | ✅ | Circular dial, mood selector, set-timer button |
| [app/(tabs)/statistic.tsx](app/(tabs)/statistic.tsx) | ✅ | Cost/usage cards, bar chart, device consumption list |
| [app/(tabs)/automations.tsx](app/(tabs)/automations.tsx) | ✅ | Scenes + Today's Scenes + Add/Create bottom sheets |
| [app/(tabs)/camera.tsx](app/(tabs)/camera.tsx) | ✅ | Placeholder live feed + camera list (no real expo-camera mount) |

### Components (18 built)
- **UI primitives**: [Button](components/ui/Button.tsx), [Card](components/ui/Card.tsx), [BottomSheet](components/ui/BottomSheet.tsx), [DeviceCard](components/ui/DeviceCard.tsx), [DeviceToggleRow](components/ui/DeviceToggleRow.tsx), [RoomCard](components/ui/RoomCard.tsx), [RoomFilterPill](components/ui/RoomFilterPill.tsx) (exports `RoomFilterPills`), [SceneCard](components/ui/SceneCard.tsx), [SectionHeader](components/ui/SectionHeader.tsx), [Sidebar](components/ui/Sidebar.tsx) (drawer + theme toggle + logout)
- **Device**: [CircularTempSlider](components/device/CircularTempSlider.tsx) (SVG + PanGesture + Reanimated), [MoodSelector](components/device/MoodSelector.tsx), [ColorPicker](components/device/ColorPicker.tsx), [ToneGlowToggle](components/device/ToneGlowToggle.tsx)
- **Onboarding**: [SlideItem](components/onboarding/SlideItem.tsx), [DotIndicator](components/onboarding/DotIndicator.tsx)
- **Home**: [HomeHeader](components/home/HomeHeader.tsx)
- **Statistic**: [EnergyBar](components/statistic/EnergyBar.tsx) (gifted-charts), [ConsumptionRow](components/statistic/ConsumptionRow.tsx)
- **Automations**: [SceneRow](components/automations/SceneRow.tsx), [TodaySceneCard](components/automations/TodaySceneCard.tsx)

### Foundations
- ✅ Design system: tokens in [constants/Colors.ts](constants/Colors.ts), CSS variables in [global.css](global.css), Tailwind extended in [tailwind.config.js](tailwind.config.js)
- ✅ Light/dark theming via [hooks/useTheme.ts](hooks/useTheme.ts) — exceeds spec (CLAUDE.md only specified dark)
- ✅ Typed mock data ([Devices.ts](constants/Devices.ts), [Rooms.ts](constants/Rooms.ts), [Scenes.ts](constants/Scenes.ts)) and shared interfaces in [types/index.ts](types/index.ts)
- ✅ Poppins fonts loaded in [app/_layout.tsx](app/_layout.tsx) with splash fallback
- ✅ Expo plugins for camera + image picker registered with permission strings in [app.json](app.json)
- ✅ TypeScript strict mode + path alias `@/*`
- ✅ Metro + NativeWind + Babel correctly configured (Reanimated plugin is bundled with `babel-preset-expo` in SDK 54 — no extra entry needed despite CLAUDE.md wording)

---

## 2. What's left ❌

### A. Spec'd screens not yet built
| Screen | Spec location | Impact |
|---|---|---|
| **Add Device Flow** (5 bottom-sheet steps: Scan → Type → Photos → Name → Room → Success) | CLAUDE.md §7 | High — biggest user flow missing |
| **Device Control – AC** (separate route with room pills + power button + timer) | CLAUDE.md §9 | Medium — `device.tsx` is close but lacks pills, power button, and is on the tab not a deep route |
| **Device Control – Light** (lamp image, intensity slider, color picker sheet, Tone Glow toggle, Set Schedule) | CLAUDE.md §10 | High — `ColorPicker` and `ToneGlowToggle` are built but unused |
| **Room Detail / Device List** (filter pills, room photo header, 2×2 device grid, Frequently Used) | CLAUDE.md §6 | High — room cards on Home don't navigate anywhere |
| **Away Mode** ("Have a good day" + lock badge + At Home / Watch CC Camera buttons) | CLAUDE.md §14 | Medium — `awayMode` state exists in `useAppState` but no screen consumes it |
| **Profile Edit** (avatar with edit badge, Name/Email/Address/Home Name fields, Cancel/Save) | CLAUDE.md §15 | Medium |

### B. Dead UI affordances (visible but non-functional)
- "Add New" pill in Home → Rooms section — no handler
- "See All" link in Frequently Used — no handler
- "Add New" in Today's Scenes — no handler (only the Scenes one wires up)
- "Add New" in Cameras — no handler
- Bell icon in every header → no notifications screen / no badge state
- Social login icons (Facebook/Google/Twitter) on Welcome and Sign In — pure decoration
- "Forgot Password?" link on Sign In — dead
- Tap-through on rooms, scene rows, camera rows, device cards — all routes missing
- Statistic "Daily" dropdown — visual only, doesn't toggle data
- Camera live feed is a static placeholder; `expo-camera` is installed but never mounted

### C. Functional bugs
1. **State doesn't share across screens.** [hooks/useAppState.ts](hooks/useAppState.ts) and [hooks/useDevices.ts](hooks/useDevices.ts) are plain hooks, not Context providers. Every consumer (`<HomeScreen>`, `<DeviceScreen>`, `<Sidebar>`, etc.) gets its own `useState`. Toggling a device on Home does **not** update the same device on the Device tab. This is the single biggest functional defect.
2. **TypeScript error**: `mixBlendMode: 'multiply'` on [components/ui/RoomCard.tsx:44](components/ui/RoomCard.tsx#L44) is not a valid React Native `ImageStyle` key. Currently fails `tsc --noEmit`.
3. **Use-before-declare**: `Scheme` is referenced on [constants/Colors.ts:47](constants/Colors.ts#L47) before its declaration on line 49. It only compiles because TS hoists types, but it's sloppy and trips some lint setups.
4. **`Device.icon` is `string`** in [types/index.ts:4](types/index.ts#L4) — every consumer has to cast via `as keyof typeof Ionicons.glyphMap`. Should be typed at the source.
5. **Sidebar Log Out** ([components/ui/Sidebar.tsx:174](components/ui/Sidebar.tsx#L174)) just navigates to `/(auth)/welcome` — it doesn't reset the (non-existent) user session.
6. **Onboarding mosaic missing**: CLAUDE.md §1 calls for slides 2 & 3 to render a 4-image mosaic over the colored background. Current implementation just uses a single background image for each slide.
7. **Reanimated worklet warning risk**: [CircularTempSlider.tsx:51-61](components/device/CircularTempSlider.tsx#L51-L61) reads `cx`/`cy` JS scope variables inside a `'worklet'` pan handler. These are constants captured at component init so it functions, but the safer pattern is to pass them via `useSharedValue` or `runOnUI`.

### D. Asset issues
- `assets/{animations}/` is the **literal folder name** (with braces) and is empty — Lottie success animation referenced in CLAUDE.md §7 / §8 has not been added.
- Room images don't match CLAUDE.md naming. Spec calls for `bedroom.jpg`, `living-room.jpg`, `study-room.jpg`, `guest-room.jpg`. You have `bed-1.png`, `bed-2.jpg`, `chair-1.jpg`, `chair-2.jpg`.
- **Image weight**: `bed-2.jpg` is 1.7 MB and `chair-2.jpg` is 2.5 MB — total `assets/images/` ~6 MB. App will be bloated; convert to WebP or downscale.
- No Lamp Light image asset for the unbuilt Light control screen.
- Stub assets (`icon.png`, `splash-icon.png`, `adaptive-icon.png`, `favicon.png`) are still the default Expo template files dated 1985 — must be replaced before store submission.

### E. Production readiness gaps (cross-cutting)
- ❌ **No backend** — all data is hardcoded mock arrays.
- ❌ **No persistence** — devices/scenes reset on each app launch.
- ❌ **No auth** — sign-in just calls `router.replace('/(tabs)')`.
- ❌ **No environment config** — no `.env`, no `expo-constants` extra config.
- ❌ **No error boundary** anywhere — a thrown render error crashes the app silently.
- ❌ **No analytics, crash reporting (Sentry/Bugsnag), or logging**.
- ❌ **No tests** — no Jest, no RTL, no Detox.
- ❌ **No EAS Build / Submit config** (`eas.json` absent).
- ❌ **No CI** (`.github/workflows/` absent).
- ❌ **README is 10 bytes** — empty for OSS / handoff.
- ❌ **No deep link handling** beyond the `scheme: "nestiq"` registration.
- ❌ **No accessibility audit** — `accessibilityLabel`, `accessibilityRole`, hit slop on small targets all unset on many components.
- ❌ **No loading / empty / error states** anywhere — every list assumes data exists.
- ❌ **No app store metadata** — privacy policy URL, support URL, app descriptions, screenshots.

---

## 3. How to fix it — recommended order

### Phase 1 — Stop the bleeding (½ day)
Address everything that blocks even a credible demo build.

1. **Fix the TS error in [components/ui/RoomCard.tsx:44](components/ui/RoomCard.tsx#L44).**
   `mixBlendMode` isn't a valid RN style. Either drop it (the visual difference is minor on already-pastel cards) or move to a web-only fork. Quick fix: remove the `mixBlendMode: 'multiply'` line.
2. **Fix the use-before-declare in [constants/Colors.ts](constants/Colors.ts).** Move `export type Scheme = 'light' | 'dark'` above line 11.
3. **Type `Device.icon`** in [types/index.ts:4](types/index.ts#L4) as `keyof typeof Ionicons.glyphMap` so all casts disappear. (Add `import type { Ionicons } from '@expo/vector-icons'` at the top.)
4. **Rename `assets/{animations}/`** → `assets/animations/`. The literal braces in the folder name will break any code that tries to `require()` a Lottie file from it.

### Phase 2 — Share state across screens (½ day)
This is the single highest-impact fix because it unlocks the whole UX.

5. **Convert `useDevices` to a Context.** Wrap `<Stack>` in [app/_layout.tsx](app/_layout.tsx) with a `<DevicesProvider>` that owns the `useState<Device[]>`. Export `useDevices()` as `useContext(DevicesContext)`. Same pattern for `useAppState`.
6. **Persist with AsyncStorage** (or `expo-secure-store` for auth) on top of the context — hydrate on app start, save on every change. `npx expo install @react-native-async-storage/async-storage`.

### Phase 3 — Build the missing screens (1–2 days)
Order by user value:

7. **Room Detail** (`app/room/[id].tsx`) — unlocks Home room-card taps. Reuse `RoomFilterPills`, `DeviceCard`, `DeviceToggleRow`.
8. **Add Device wizard** — 5-step flow. Each step is a `<BottomSheet>` controlled by a parent `addDeviceStep` state. The Success step is the only place that actually needs Lottie; until then, reuse the icon checkmark pattern from `sign-up.tsx`.
9. **Device Control – Light** (`app/device/[id].tsx`) — wires up the already-built `ColorPicker` and `ToneGlowToggle`. Add an `IntensitySlider` component (use `react-native-gesture-handler` PanGesture over a track, or `@react-native-community/slider`).
10. **Device Control – AC** — duplicate of `device.tsx` content but inside `[id].tsx` so it varies per device. Add the room filter pills row and the round power button on the right of the title.
11. **Away Mode** (`app/away.tsx`) — surface from Sidebar; flip the `awayMode` flag in `useAppState`.
12. **Profile Edit** (`app/profile.tsx`) — straightforward form using the existing Field component patterns from sign-up.

### Phase 4 — Wire up dead affordances (½ day)
13. Add handlers for every `actionLabel` you've placed: Home Rooms "Add New" → wizard, "See All" → device list filtered by frequently-used, Camera "Add New" → camera wizard, etc.
14. Build a minimal `app/notifications.tsx` and route the bell icon to it.
15. Either remove the social login icons or stub them with a "Coming soon" toast.

### Phase 5 — Real auth + backend (1+ week, scope dependent)
16. Pick an auth provider: Clerk Expo, Supabase, or Firebase. The form UIs you have are ready to point at any of them.
17. Replace the mock arrays with API calls; keep the same shapes so screens don't need to change.
18. Add a `<QueryClientProvider>` (TanStack Query) at root for caching/optimistic toggles.

### Phase 6 — Polish for store submission (1–2 days)
19. **Optimize images**: convert `bed-*.jpg` and `chair-*.jpg` to WebP at half resolution. Target <200 KB each.
20. **Replace the template app icon, splash, adaptive icon, favicon**.
21. **Write a real `README.md`** with setup, environment, and run instructions.
22. **Add an `ErrorBoundary`** at the root, log to Sentry.
23. **Add loading / empty states** on every list, especially Statistic and Cameras.
24. **Accessibility pass**: `accessibilityRole="button"` on every `Pressable`, `accessibilityLabel` on icon-only buttons, ensure 44×44 hit area minimum.
25. **EAS config**: `npx eas build:configure`, set up `eas.json` with dev/preview/production profiles.
26. **CI**: a tiny GitHub Action running `tsc --noEmit` and `expo-doctor` on PRs.
27. **App store assets**: 6.7" iPhone screenshots, app description, keywords, privacy policy URL.

---

## 4. Quick-win checklist (in priority order)

Run these before the next build to clear the lowest-hanging fruit:

- [ ] Remove `mixBlendMode` from [RoomCard.tsx:44](components/ui/RoomCard.tsx#L44) → fixes `tsc`
- [ ] Reorder `Scheme` type vs `Colors` const in [Colors.ts](constants/Colors.ts)
- [ ] Tighten `Device.icon` type in [types/index.ts](types/index.ts)
- [ ] Rename `assets/{animations}/` → `assets/animations/`
- [ ] Promote `useDevices` and `useAppState` to React Context
- [ ] Hook up `onPress` for room cards (placeholder route is fine for now)
- [ ] Replace 1.7–2.5 MB JPGs with WebP at ~200 KB
- [ ] Replace template Expo icons/splash with real branding
- [ ] Write a real `README.md`

---

## 5. Verification commands

```bash
# In project root: /Users/danemmanuel/Documents/nestiq/nestiq
npx tsc --noEmit            # currently fails with 1 error in RoomCard.tsx
npx expo-doctor             # not yet run — recommended before each build
npx expo start              # smoke-test the app boots after each phase
```
