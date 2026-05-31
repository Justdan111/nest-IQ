# NestIQ — Full App Diagnosis

_Generated: 2026-05-31_

This is a top-to-bottom audit of the NestIQ codebase as it currently stands at
`/Users/danemmanuel/Documents/nestiq/nestiq`. It covers what the app is, what
has been built, whether the architecture will scale, and what work remains
before this can ship to the Apple App Store and Google Play Store.

---

## 1. What NestIQ is

NestIQ is a **smart-home / IoT dashboard** mobile app built with **React Native
+ Expo + Expo Router + NativeWind (Tailwind for RN)**. The goal is to let a
user:

- Sign up / sign in, then set up a "home"
- Browse rooms grouped by category (Bed Room, Living Room, Kitchen, Dining, …)
- Add rooms, upload photos/videos for each room, and attach devices to them
- Add, name, and connect smart devices (AC, lamps, fans, speakers, cameras, locks)
- Control individual devices on dedicated screens (AC dial + mood + timer;
  lamp color picker + tone glow + intensity + schedule)
- Build and schedule "scenes" (automations: Rise n' Shine, Movie Night, …)
- View energy / cost statistics with bar charts and per-device consumption
- Watch live (placeholder) CCTV feeds per room
- Lock / unlock doors and toggle a global Away Mode
- Edit a profile, toggle dark / light mode, manage notifications

The visual identity is dark-first (`#0A0A0A` background, `#1A1A1A` surfaces,
`#3B6FF0` primary blue) with a full light-theme companion mapped through CSS
variables.

---

## 2. What has been built (current state)

### 2.1 App entry & navigation

- **Entry redirect** — [app/index.tsx](app/index.tsx) sends every cold start to
  `/onboarding`. There is **no auth-state check** — see §5.1.
- **Root layout** — [app/_layout.tsx](app/_layout.tsx) mounts fonts (Poppins
  400/500/600/700), the gesture handler root, safe area provider, and all four
  context providers in the order `AppState › Rooms › Devices › Scenes`. The
  Stack uses `animation: 'fade'`.
- **Auth stack** — [app/(auth)/_layout.tsx](app/(auth)/_layout.tsx) — a plain
  background-tinted stack.
- **Tabs layout** — [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx) — custom
  floating tab bar (Home in its own pill, the other four in a shared pill),
  wrapped in `SidebarProvider` so every tab screen can open the drawer.
- **Theme** — `:root` (light) and `.dark:root` CSS vars in
  [global.css](global.css), mapped in
  [tailwind.config.js](tailwind.config.js) to semantic Tailwind tokens
  (`bg-surface`, `text-text`, `border-border`, …). JS-side colors come from
  [hooks/useTheme.ts](hooks/useTheme.ts) which wraps NativeWind's
  `useColorScheme`.

### 2.2 Onboarding & auth flow

| Screen | File | Status |
|---|---|---|
| Onboarding (3 slides, Skip, dot indicator) | [app/onboarding.tsx](app/onboarding.tsx) | UI complete; **no persistence** of "seen" |
| Welcome (full-bleed photo + glassy buttons + social row) | [app/(auth)/welcome.tsx](app/(auth)/welcome.tsx) | UI complete; **social buttons are decorative** (no onPress) |
| Sign In | [app/(auth)/sign-in.tsx](app/(auth)/sign-in.tsx) | UI complete; **no validation, no API**; Sign-In button just `router.replace('/(tabs)')` |
| Sign Up | [app/(auth)/sign-up.tsx](app/(auth)/sign-up.tsx) | UI complete; Phone field has hard-coded 🇳🇬 +234; Congratulations sheet works; **no API call** |
| Home Setup (intro) | [app/(auth)/home-setup.tsx](app/(auth)/home-setup.tsx) | UI complete |
| Home Select ("Filllo House" / "Create New") | [app/(auth)/home-select.tsx](app/(auth)/home-select.tsx) | UI complete; both options route into `(tabs)` regardless of selection |

### 2.3 Tab screens

| Tab | File | Status |
|---|---|---|
| **Home** | [app/(tabs)/index.tsx](app/(tabs)/index.tsx) | Header + "My rooms" pastel category grid + "Frequently Used" toggle rows (just `devices.slice(0,4)` — not based on real usage). Working. |
| **Device** | [app/(tabs)/device.tsx](app/(tabs)/device.tsx) | Original AC circular dial screen + "More Details" → `/devices`. **The dial's temperature value is local state only** — it doesn't persist to a device or affect anything. |
| **Statistic** | [app/(tabs)/statistic.tsx](app/(tabs)/statistic.tsx) | Cost / Usage cards (hard-coded $170 / 99 kWh), Daily/Weekly/Monthly dropdown + bar chart (all mock arrays), Device Power Consumption list (also hard-coded). |
| **Automations** | [app/(tabs)/automations.tsx](app/(tabs)/automations.tsx) | Scenes section + Today's Scenes grid. 4-step create-scene flow (`add-scene → create-name → add-device → confirm-device → success`) is wired and persists via `useScenes`. Suggested scenes route into the create flow with the name pre-filled. **No edit / delete for existing scenes**. |
| **Camera** | [app/(tabs)/camera.tsx](app/(tabs)/camera.tsx) | Hero feed + 4 camera list rows + fullscreen modal. The CAMERAS array is hard-coded inline. `CameraFeed` is structured for HLS/RTSP but no `streamUrl` is ever set, so it always shows `PLAYBACK`. **"Add New" pill has no `onPress`**. |

### 2.4 Rooms

- **Room list** — [app/rooms/index.tsx](app/rooms/index.tsx) — category pills
  (with "+ Add" sheet to create new categories), room cards (hero image with
  gradient + device-on count), and a 4-step Add Room flow
  (`name → category → photos → devices → success`). The flow works and adds
  rooms via `useRooms`. **The selected device types in step 4 are not
  actually persisted on the room**.
- **Room detail** — [app/rooms/[id].tsx](app/rooms/[id].tsx) — hero photo with
  media menu (View / Add / Live CCTV), device grid, header overflow menu with
  Edit (renames cascade to devices via `renameRoomDevices`) and Delete
  (cascades via `removeRoomDevices`). Real `expo-image-picker` is wired for
  library + camera capture. Live CCTV link explicitly shows an alert
  ("not yet connected"). Add-Device flow on this screen is a stub — it does
  **not actually create devices**, it just shows the success modal.

### 2.5 Devices

- **Device list** — [app/devices/index.tsx](app/devices/index.tsx) — every
  device in a grid + Frequently Used. Tapping a device routes through
  `controlRouteForDevice()` ([components/device/controlRoute.ts](components/device/controlRoute.ts)),
  which maps `'ac' → /devices/control/ac`, `'light' → /devices/control/light`,
  and returns `null` for everything else (fans, speakers, cameras, locks → no
  detail screen).
- **Add Device** — [app/devices/add.tsx](app/devices/add.tsx) — Scan / WiFi
  picker → Name sheet → Select Room (single-select chips) → SuccessModal →
  `router.replace('/devices')`. Real `addDevice` runs. **The Scan/WiFi mode
  itself is not implemented** — no camera scanner, no NFC/Bluetooth pairing.
- **AC control** — [app/devices/control/ac.tsx](app/devices/control/ac.tsx) —
  room filter pills (category names), circular dial, mood selector, set-timer
  bottom sheet with a wheel picker. **The temperature and mood are local
  state — they don't persist on the `Device` object. The timer is not
  scheduled.** Power button does toggle the device's `isOn`.
- **Light control** — [app/devices/control/light.tsx](app/devices/control/light.tsx) —
  full UI: room pills, lamp hero image (opacity dimmed when off), color picker
  sheet, tone glow toggle, intensity slider, schedule sheet with month
  calendar + multi-day select + on/off time editor. **None of this is
  persisted on the device.**

### 2.6 Settings / profile / security / away

| Screen | File | Status |
|---|---|---|
| Settings | [app/settings.tsx](app/settings.tsx) | Dark Mode toggle (real, hits `setColorScheme`); Push Notifications + Email Alerts toggles (local state only); links to Security and Away. |
| Profile Edit | [app/profile.tsx](app/profile.tsx) | Avatar (initials only), name/email/address/home-name form, Save persists into `useAppState`. **Avatar pencil button has no handler** — no upload flow. |
| Security | [app/security.tsx](app/security.tsx) | Home/Away segmented control + locked-door lists. Wires into `awayMode` global state. Local door state only. |
| Away Mode | [app/away.tsx](app/away.tsx) | Stylized illustration + "At Home" + "Watch CC Camera" buttons. Toggles `awayMode` correctly. |

### 2.7 Shared UI primitives

`components/ui/`: `Button`, `BottomSheet`, `Card`, `CategoryCard`, `DeviceCard`,
`DeviceToggleRow` (+ `LabeledToggle`), `ImageViewer`, `RoomFilterPill`,
`SceneCard`, `SectionHeader`, `Sidebar` (drawer), `SuccessModal`.

`components/device/`: `CircularTempSlider`, `ColorPicker`, `IntensitySlider`,
`MoodSelector`, `ToneGlowToggle`, `WheelPicker`, `controlRoute.ts`.

`components/automations/`: `SceneRow`, `TodaySceneCard`.
`components/statistic/`: `EnergyBar` (gifted-charts), `ConsumptionRow`.
`components/camera/`: `CameraFeed` (poster + LIVE/PLAYBACK overlay).
`components/home/HomeHeader.tsx`, `components/onboarding/{SlideItem,DotIndicator}`.

### 2.8 State / data layer

Four React Context providers, mounted in [app/_layout.tsx:34-55](app/_layout.tsx#L34-L55):

- `AppStateProvider` — `user` + `awayMode` ([hooks/useAppState.ts](hooks/useAppState.ts))
- `RoomsProvider` — `rooms`, `categories`, `addRoom`, `updateRoom`,
  `deleteRoom`, `addCategory`, `addRoomMedia` ([hooks/useRooms.ts](hooks/useRooms.ts))
- `DevicesProvider` — `devices`, `toggleDevice`, `addDevice`, `devicesByRoom`,
  `activeCount`, `renameRoomDevices`, `removeRoomDevices` ([hooks/useDevices.ts](hooks/useDevices.ts))
- `ScenesProvider` — `scenes`, `suggested`, `addScene` ([hooks/useScenes.ts](hooks/useScenes.ts))

Seed data lives in [constants/Devices.ts](constants/Devices.ts),
[constants/Rooms.ts](constants/Rooms.ts), [constants/Scenes.ts](constants/Scenes.ts).
Types in [types/index.ts](types/index.ts). Color tokens in
[constants/Colors.ts](constants/Colors.ts).

**Critical:** state is in-memory only. **Nothing persists across app
restarts** — every cold launch resets to seed data.

---

## 3. Is the structure scalable?

**Yes, with caveats.** The bones are right; the body is missing.

### What is good
- **File-based routing** with Expo Router groups is clean and idiomatic.
  `(auth)` and `(tabs)` cleanly segregate gated vs. ungated flows.
- **Provider tree** (`AppState › Rooms › Devices › Scenes`) is small and
  flat. No deep prop drilling, no spurious context proliferation.
- **Theme system** (CSS-var tokens flipped by NativeWind's `dark` class +
  parallel JS palette in `useTheme`) is one of the more solid pieces in the
  app — easy to extend.
- **Reusable UI primitives** are well factored: every flow that needs a
  bottom sheet uses `BottomSheet`, every "X added!" reuses `SuccessModal`,
  every "Title + action" row uses `SectionHeader`. New screens won't need to
  reinvent these.
- **TypeScript strict mode** is on; types in `types/index.ts` are clean
  (`Device`, `Room`, `Category`, `Scene`, `User`, `RoomMedia`).
- **NativeWind v4 + Tailwind 3** is configured correctly (`darkMode: 'class'`,
  Babel preset, JSX import source). No StyleSheet sprawl.
- **Cascade helpers** (`renameRoomDevices`, `removeRoomDevices`) show the team
  is thinking about referential integrity even with no DB. That mindset will
  transfer cleanly to a real backend.

### What will need to change before this scales
- **Devices reference rooms by string name, not id** (see `Device.room: string`).
  This works for mock data, but on a backend you'll want `roomId: string` plus
  a `Room` lookup. The cascade rename helper is a workaround for this design.
- **No persistence layer.** All state is in-memory React state. You will need
  to add either AsyncStorage / MMKV (for local cache) and/or a real backend
  (see §4) before this is usable as a product.
- **No API/service layer.** There is no `services/`, no `api/`, no fetch
  client, no error handling, no retry, no auth tokens. When the backend
  arrives this should slot in cleanly next to `hooks/`.
- **Frequently Used = first 4 devices**, not actually computed from usage.
  Fine as a placeholder, but plan to back it with a real `lastUsedAt`.
- **No feature folders.** Today everything is split by *kind* (components,
  hooks, constants). For ~15 screens that's fine; past 30 you'll want
  `features/devices/{screens,hooks,components}`.

Verdict: the architecture is appropriate for the current scope and will not
need to be rewritten — it will need to be **extended** with networking,
persistence, and real device pairing.

---

## 4. What's missing (the gap to production)

### 4.1 Functionality not yet implemented

#### Auth / accounts
- **No real authentication.** Sign-In and Sign-Up just navigate forward. There
  is no API call, no credential validation, no session token, no refresh, no
  sign-out logic anywhere. The Sidebar "Logout" routes to `/(auth)/welcome`
  but does not clear state.
- **No "remember me" / no auto-login.** [app/index.tsx](app/index.tsx) always
  redirects to onboarding — repeat users will see it again.
- **No social sign-in.** Facebook / Google / Twitter buttons on
  [welcome.tsx](app/(auth)/welcome.tsx#L48-L61) and
  [sign-in.tsx](app/(auth)/sign-in.tsx#L76-L88) are decorative only.
- **No forgot password.** Link in [sign-in.tsx:54-56](app/(auth)/sign-in.tsx#L54-L56) has no handler.
- **No email verification, no phone OTP.** Phone field exists in sign-up but
  is purely visual; country code is hard-coded to 🇳🇬 +234.
- **No terms-and-conditions screen / privacy policy screen** — sign-up has a
  checkbox referencing them but nothing to display.

#### Device pairing
- **Scan Code / WiFi / Bluetooth pairing is not implemented.** The
  [add.tsx](app/devices/add.tsx) screen renders the picker but selecting Scan
  doesn't open the camera, and selecting WiFi doesn't scan for networks. There
  is no QR scanner, no Bluetooth, no NFC.
- **Device-add flow inside Room Detail** ([rooms/[id].tsx:295-350](app/rooms/[id].tsx#L295-L350))
  shows the picker UI but never calls `addDevice` — the success modal fires
  with no actual mutation.

#### Device control
- **AC temperature, mood, and timer don't persist** — purely local component
  state. Closing/reopening the screen loses everything.
- **Light color, tone, intensity, and schedule don't persist** — same issue.
- **No timer / schedule engine.** Setting a timer or schedule has no effect;
  there is no background task, no notification trigger, no `expo-task-manager`,
  no `expo-notifications` integration.
- **Power buttons on AC and Light screens** do flip `isOn`, but the device's
  current operating state (set point, color, etc.) is decoupled.

#### Cameras / CCTV
- **No live video.** `CameraFeed` is structured for it (clear `streamUrl`
  hook), but no `expo-video` / `expo-av` is in `package.json`. Every camera
  shows the static poster image with a faked elapsed-time counter.
- **"Add New" pill on the Camera tab has no handler** — the most visible
  call-to-action on the screen does nothing.
- **Cameras list is hard-coded** in [camera.tsx:29-62](app/(tabs)/camera.tsx#L29-L62);
  it isn't backed by `useDevices` even though devices of type `camera` exist.

#### Scenes / automations
- **Scenes can be created but not edited or deleted.** Tapping `TodaySceneCard`
  has no handler.
- **Schedules don't fire.** Scene "time"/"repeat" fields are stored but no
  trigger ever runs them.

#### Stats
- **Everything is mock data.** Cost, kWh, the bar chart, and the consumption
  list are all hard-coded literals in [statistic.tsx](app/(tabs)/statistic.tsx).
- **No drill-down into per-device usage history**, which CLAUDE.md calls for.

#### Notifications
- **Bell icons on every screen header are non-functional.** No notifications
  screen, no inbox, no badge.
- **No push notifications.** Toggle in Settings sets a local boolean only.
  `expo-notifications` is not installed; no APNs / FCM credentials configured.

#### Sidebar items
- "Cars", "Users", "Support" routes are unimplemented — they show
  `Alert.alert('Coming soon', …)` per [Sidebar.tsx:86](components/ui/Sidebar.tsx#L86).
- "Push Notification" routes to `/settings` rather than a dedicated screen.

#### Profile
- Avatar **pencil/edit badge has no `onPress`** ([profile.tsx:61-67](app/profile.tsx#L61-L67)) —
  the most expected interaction on the profile screen is dead.
- No image picker integration for avatar upload.

#### Room media
- "Take New Photo" tile inside the Add Room → Photos step
  ([rooms/index.tsx:497-511](app/rooms/index.tsx#L497-L511)) is rendered but
  **not pressable** — only the three preset photos can be selected during
  initial room creation. Camera + library do work on the Room Detail screen.
- `ImageViewer` doesn't actually play videos — the comment at
  [ImageViewer.tsx:25](components/ui/ImageViewer.tsx#L25) confirms it (no
  `expo-av` / `expo-video` installed).

### 4.2 Persistence & backend

- **No persistence at all.** No `AsyncStorage`, no `expo-secure-store`, no
  MMKV. Every restart resets to seed data.
- **No backend.** No API client, no environment variables for endpoints,
  no `.env`, no auth header pipeline.
- **No real-time sync.** A real IoT app needs WebSocket / MQTT for live
  device state — none of that exists.
- **No offline support / sync queue.**

### 4.3 Production / store readiness

- **App icon and splash use Expo defaults** (`./assets/icon.png`,
  `./assets/adaptive-icon.png`, `./assets/splash-icon.png`). Branded assets
  must replace them before submission.
- **No EAS Build config** — `eas.json` does not exist. EAS is required to
  produce signed iOS / Android binaries for the stores.
- **No Apple Developer account / Google Play Console linkage** is reflected
  in the repo. Bundle ID `com.nestiq.app` and Android package `com.nestiq.app`
  need to be registered.
- **No App Store metadata** — no screenshots, no app preview, no description,
  no privacy nutrition labels, no age rating, no support URL, no marketing
  URL.
- **No privacy policy URL** — both stores require one, especially because
  the app already declares camera and photos permissions in
  [app.json:36-47](app.json#L36-L47).
- **No crash reporting** (Sentry, Bugsnag, Crashlytics) — required for any
  serious production app.
- **No analytics** (PostHog, Amplitude, Firebase Analytics).
- **No tests** — no Jest, no Detox, no Maestro. Zero coverage.
- **No CI** — no GitHub Actions / EAS workflow / lint check on PRs.
- **No linting / formatting enforced** — Prettier-tailwind plugin is in
  devDependencies, but there's no ESLint config and no `lint`/`format`
  script in `package.json`.
- **No telemetry kill-switch / remote config** (LaunchDarkly, GrowthBook,
  Expo updates channels).
- **`README.md` is 10 bytes** — no developer onboarding docs.
- **No Lottie animations exist** despite `lottie-react-native` being a
  dependency and CLAUDE.md referencing `assets/animations/success-check.json`.
  The success animation has been re-implemented in pure RN inside
  [SuccessModal.tsx](components/ui/SuccessModal.tsx) — either drop the
  dependency or restore the Lottie asset.
- **Permissions:** `expo-camera` and `expo-image-picker` permissions are
  declared. Microphone permission is **not** declared — if you add video
  recording or live calling later you'll need it. Background location, push,
  motion are all undeclared.
- **iOS `supportsTablet: true`** is enabled but the UI has never been audited
  on iPad — layouts may break on large screens. Either test thoroughly or
  set to `false` until that's planned.
- **Android `predictiveBackGestureEnabled: false`** is set — fine for now,
  but plan to enable it when targeting Android 14+ properly.
- **`newArchEnabled: true`** is on — verify all native deps support it
  (`react-native-gifted-charts`, `react-native-linear-gradient`, `lottie`,
  `moti`, `reanimated v4` are the risk surface).

### 4.4 UX / polish gaps

- **No loading states anywhere.** Buttons don't show spinners on submit
  (only the design intent is in `Button.loading`, but no caller passes it).
- **No empty-state illustrations** beyond a centered icon + line. Compare to
  the rich onboarding/away screens.
- **No error toasts / snackbars.** Currently everything uses native
  `Alert.alert` (`Sidebar`, room media flow). Pick a real toast library.
- **Bell icons on every header are inert** — either make them open a real
  notifications screen or remove them.
- **No haptics.** A device toggle in a home-control app should buzz.
- **No accessibility audit.** Some `accessibilityRole` / `accessibilityState`
  exists in the tab bar but most pressables lack labels for VoiceOver /
  TalkBack.
- **Light theme has not been visually verified** end-to-end. Several screens
  hard-code dark hex colors (`bg-black/50` overlays, hard-coded text colors
  inside `CategoryCard`, `away.tsx` border `'#0A0A0A'`). They'll look fine
  in dark mode and probably break in light. Search for hard-coded `#0A0A0A`,
  `#FFFFFF`, `bg-black/` and swap for theme tokens where appropriate.
- **The Add Room → "Devices" step doesn't actually create those devices
  in the new room.** The selected types are dropped on the floor when
  `finalize()` runs.
- **The Room Detail Add-Device sheet** also picks types but never calls
  `addDevice` — only fires the success modal.
- **Add-category modal**: returned category id from `addCategory` has a race
  ([useRooms.ts:62-73](hooks/useRooms.ts#L62-L73)) — the helper reads
  `categories.length` from the closure to derive the palette before the state
  update commits. Fine in practice today, but flaky if anyone calls
  `addCategory` twice in the same render.

### 4.5 Asset gotchas (from prior notes)

- `bed-1.png` ships with a baked-in transparency-checker pattern — do not
  use it with `mixBlendMode: 'multiply'`.
- Portrait JPGs (`bedroom-02`, `bedroom-03`) need `resizeMode="contain"` on
  the room list cards; `cover` crops them weirdly.

---

## 5. Concrete punch list to ship

Organized by priority. The first three sections are non-negotiable for a
public release. Section 5.4 is "polish that customers will notice on day one."

### 5.1 Must-have before ANY store submission

1. **Pick a backend.** Realistic options:
   - Firebase Auth + Firestore + Cloud Functions (fastest)
   - Supabase (Postgres + Auth + Realtime)
   - Custom Node/Go API + Postgres
   Once chosen, build a `services/api.ts` layer, swap context providers from
   in-memory `useState` to fetched + cached state, add `AsyncStorage`/MMKV
   for offline cache.
2. **Real auth.** Email/password at minimum, plus persistent session via
   `expo-secure-store`. Make [app/index.tsx](app/index.tsx) read the session
   on mount and redirect to `/onboarding` only on first run (use a
   `hasSeenOnboarding` flag), to `/(tabs)` if logged in, or to
   `/(auth)/welcome` otherwise.
3. **Persist user actions.** Toggling a device, adding a scene, uploading
   media, editing a profile, changing theme — every one of these resets on
   relaunch today.
4. **Real device pairing — or hide it.** Either implement at least one
   real pairing path (BLE via `react-native-ble-plx`, or QR scan via
   `expo-camera` + `expo-barcode-scanner`) or scope the v1 release to
   "manual add only" and rename the flow.
5. **Privacy policy + Terms URLs** hosted somewhere public. Required by both
   stores; sign-up references them already.
6. **Crash reporting.** Install `sentry-expo` (or Bugsnag/Crashlytics) and
   wire an error boundary at the root.
7. **Branded splash, icon, adaptive icon, favicon.** Replace the Expo
   defaults in `assets/`.
8. **EAS Build setup.** `npx eas init`, fill out `eas.json` with
   `development` / `preview` / `production` profiles, configure iOS code
   signing and Android keystore (let EAS manage them).
9. **Bundle ID + package registration.** `com.nestiq.app` on Apple Developer
   Portal, `com.nestiq.app` on Google Play Console.
10. **Store listings.** Screenshots (6.7" / 6.1" iOS, phone + tablet
    Android), descriptions, keywords, support email, privacy URL, age
    rating questionnaire, App Privacy nutrition labels.

### 5.2 Functionality required to deliver on the product promise

11. **Implement the actual device commands.** AC set-point, mood, timer;
    Light color, tone, intensity, schedule — wire them through whatever
    IoT layer you pick (Matter via `react-native-matter`, Home Assistant
    REST, vendor APIs, MQTT broker, …).
12. **Push notifications.** Install `expo-notifications`, configure APNs +
    FCM in EAS, wire the toggle in Settings to real subscription, build a
    notifications inbox screen behind every bell icon.
13. **Live camera feeds.** Add `expo-video` (or `react-native-video`) and
    swap the Image inside `CameraFeed` for a `<Video>` when `streamUrl` is
    set. Likely needs RTSP-to-HLS transcoding server-side.
14. **Schedule engine.** Local schedules via `expo-notifications`
    triggers + `expo-task-manager`; cloud schedules via the backend.
15. **Scene edit / delete.** Add an overflow menu on `TodaySceneCard` and a
    full edit flow (reuse the create-scene bottom sheets).
16. **Stats from real data.** Wire `EnergyBar` and `ConsumptionRow` to
    aggregated device telemetry. Drill-down screen per device.
17. **Forgot password flow.**
18. **Email verification + phone OTP.** Even if optional, build the screens.
19. **Avatar upload.** `expo-image-picker` is already a dependency.
20. **Notifications screen** behind every bell icon (one missing screen
    referenced from ~7 places).
21. **Settings → real preferences:** persist Push and Email toggles to user
    account.
22. **Fix the room/device cascade gaps:**
    - Add-Room's "Devices" step should actually create devices in the new room.
    - Room-Detail Add-Device sheet should call `addDevice`.
    - `Take New Photo` tile in Add-Room photos step needs an onPress.
23. **Wire the social sign-in buttons** (or remove them).
24. **Sidebar dead links** ("Cars", "Users", "Support") — implement or remove.
25. **Camera tab "Add New"** — implement an add-camera flow, or hide the pill.

### 5.3 Quality / engineering hygiene

26. **Add tests.** At minimum: Jest unit tests for the hooks
    (`useDevices`, `useRooms`, `useScenes`), and Maestro flows for sign-up
    → tabs, add-room, add-device, toggle-scene.
27. **Add ESLint + Prettier scripts.** `eslint-config-expo` is the easy
    start. Hook into CI.
28. **CI pipeline.** GitHub Actions: typecheck, lint, test, expo export on
    every PR; EAS Build on `main`.
29. **Refactor `Device.room: string` → `Device.roomId: string`.** Drop the
    `renameRoomDevices` helper once you no longer reference rooms by name.
30. **Refactor `useRooms.addCategory` to compute its palette from the
    next-state length** (avoid the closure stale-read).
31. **Centralize the `DEVICE_TYPES` literal** that is currently duplicated
    in [rooms/index.tsx](app/rooms/index.tsx#L17-L29) and
    [rooms/[id].tsx](app/rooms/[id].tsx#L21-L33).
32. **Theme-token audit.** Sweep for `#0A0A0A`, `#FFFFFF`, `bg-black/`,
    `text-white` on non-brand backgrounds. Replace with semantic tokens
    where the surface itself flips with the theme.
33. **`README.md`** with setup, scripts, architecture overview.
34. **Drop or use `lottie-react-native`.** If you keep it, build the
    success animation in Lottie for nicer feel; otherwise remove from
    `package.json`.
35. **Verify New Architecture compatibility** on every native dep.
36. **iPad layout audit** (or set `supportsTablet: false`).

### 5.4 Polish (do this before launch screenshots)

37. **Loading states** on every async button.
38. **Toast / snackbar system** to replace `Alert.alert`.
39. **Haptics** on device toggles, scene activations, lock/unlock.
40. **Accessibility labels** on every Pressable; screen-reader pass.
41. **Skeleton loaders** for room list / device list / stats.
42. **Empty states** with friendly illustrations.
43. **Pull-to-refresh** on Home, Rooms, Devices, Camera.
44. **Light theme QA** end-to-end.
45. **Error boundaries** at each route and a global one.
46. **Onboarding "first launch only" gate** (`hasSeenOnboarding` flag in
    AsyncStorage).

### 5.5 Optional but valuable

- **OTA updates** via `expo-updates` so you can hotfix without re-submitting.
- **Remote config / feature flags** so unfinished features can be hidden
  behind a flag for TestFlight builds.
- **Internationalization** via `i18next` — even if you ship in English only,
  having the scaffolding pays off later.
- **App-icon variants** (different icons per region / season) — Expo
  supports it on iOS.
- **Deep linking** — `nestiq://` scheme is declared in `app.json`; nothing
  consumes it yet. Plan link routes for "open device X" / "open scene Y" to
  power notifications and Siri shortcuts.

---

## 6. TL;DR

- The **app's UI is roughly 90% built** against the CLAUDE.md spec. It
  looks like the designs.
- The **app's underlying functionality is ~10% built**. Nearly everything
  the user can tap that *looks* like it does something is in fact local
  React state with no persistence, no API, and no real device behind it.
- **Architecture is sound** and won't need to be torn up. You'll bolt a
  persistence layer + an API layer + a real-time layer on top of the
  existing context hooks.
- **Critical path to App Store / Play Store** = pick a backend → real auth
  + persistence → real device pairing (or scope it out of v1) → push +
  privacy policy + crash reporting → EAS Build + signed binaries + store
  listings. Everything else in §5 is iteration after launch.

If you want a shorter milestone target: an **internal alpha** is reachable
with §5.1 (10 items) plus #11, #12, #13, #19, #22, #25 from §5.2 — that
gets you something that can be installed via TestFlight / Play Internal
Testing and actually controls one real device. Everything else can be
rolled out as updates.
