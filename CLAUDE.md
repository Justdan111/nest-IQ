# NestIQ — Smart Home IoT App
## Claude Code Instructions

This is a React Native + Expo app built with NativeWind (TailwindCSS). Follow these instructions for every task.

---

## Tech Stack

- **Framework**: Expo SDK 51+ with Expo Router (file-based routing)
- **Styling**: NativeWind v4 (TailwindCSS for React Native)
- **Language**: TypeScript (strict mode)
- **Animations**: React Native Reanimated v3 + Moti
- **Icons**: Expo Vector Icons (Ionicons + MaterialCommunityIcons)
- **Navigation**: Expo Router with bottom tabs
- **State**: React Context + useState/useReducer (no external state lib)
- **Charts**: react-native-gifted-charts (Statistic screen)
- **Circular Slider**: react-native-circular-slider or custom SVG (Device Control AC)

---

## Design System

### Colors (always use these, never hardcode hex elsewhere)
```ts
// constants/Colors.ts
export const Colors = {
  primary: '#3B6FF0',       // Blue — buttons, active states, highlights
  primaryDark: '#2952C8',   // Pressed blue
  background: '#0A0A0A',    // App background (near-black)
  surface: '#1A1A1A',       // Cards, bottom sheets
  surfaceAlt: '#242424',    // Slightly lighter cards
  border: '#2A2A2A',        // Subtle borders
  textPrimary: '#FFFFFF',   // Main text
  textSecondary: '#8A8A8A', // Muted text / labels
  textMuted: '#555555',     // Very muted
  success: '#3B6FF0',       // Connected / On (same as primary)
  error: '#E24B4A',         // Error states
  warning: '#EF9F27',       // Warning / energy stats
}
```

### Typography rules
- Headings: `text-white font-semibold text-xl`
- Body: `text-white text-base`
- Muted labels: `text-[#8A8A8A] text-sm`
- Screen titles (center, nav bar): `text-white font-semibold text-lg text-center`

### Spacing
- Screen horizontal padding: `px-5`
- Card padding: `p-4`
- Section gap: `mb-6`
- Item gap: `gap-3`

### Components style rules
- **Cards**: `bg-[#1A1A1A] rounded-2xl p-4`
- **Active/Selected card**: `bg-[#3B6FF0] rounded-2xl p-4`
- **Bottom sheets**: `bg-[#1A1A1A] rounded-t-3xl px-5 pt-4 pb-8`
- **Primary button**: `bg-[#3B6FF0] rounded-full py-4 items-center`
- **Outline button**: `border border-[#3B6FF0] rounded-full py-4 items-center`
- **Toggle (On)**: Use Switch with `trackColor={{ true: '#3B6FF0' }}`
- **Room filter pills**: Active = `bg-[#3B6FF0] rounded-full px-4 py-2`, Inactive = `bg-[#1A1A1A] rounded-full px-4 py-2 border border-[#2A2A2A]`
- **Input fields**: `bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white`

---

## Project Structure

```
nestiq/
├── app/
│   ├── _layout.tsx                  # Root layout, fonts, splash
│   ├── index.tsx                    # Redirect → onboarding or tabs
│   ├── onboarding.tsx               # Onboarding slides (3 slides)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx              # Welcome / splash with CTA buttons
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   └── (tabs)/
│       ├── _layout.tsx              # Bottom tab navigator
│       ├── index.tsx                # Home screen
│       ├── device.tsx               # Device screen (circular temp control)
│       ├── statistic.tsx            # Statistics / energy usage
│       ├── automations.tsx          # Scenes & automations
│       └── camera.tsx               # CC Camera / real-time view
├── components/
│   ├── ui/
│   │   ├── Button.tsx               # Primary + outline variants
│   │   ├── Card.tsx                 # Base card wrapper
│   │   ├── BottomSheet.tsx          # Reusable modal bottom sheet
│   │   ├── DeviceToggleRow.tsx      # Device name + toggle row
│   │   ├── DeviceCard.tsx           # Grid device card (icon + name + toggle)
│   │   ├── RoomCard.tsx             # Room card with image + name
│   │   ├── RoomFilterPill.tsx       # Scrollable room filter tabs
│   │   ├── SceneCard.tsx            # Scene card (colored bg + time)
│   │   └── SectionHeader.tsx        # "Title" + "Add New" / "See All" row
│   ├── onboarding/
│   │   ├── SlideItem.tsx            # Single fullscreen onboarding slide
│   │   └── DotIndicator.tsx         # Animated dot indicators
│   ├── home/
│   │   └── HomeHeader.tsx           # Avatar + greeting + bell
│   ├── device/
│   │   ├── CircularTempSlider.tsx   # Circular dial for AC temperature
│   │   ├── MoodSelector.tsx         # Cool/Heat/Wind/Auto buttons
│   │   ├── ColorPicker.tsx          # Color circles for lamp
│   │   └── ToneGlowToggle.tsx       # Warm / Cold segmented control
│   ├── statistic/
│   │   ├── EnergyBar.tsx            # Bar chart (gifted-charts)
│   │   └── ConsumptionRow.tsx       # Device consumption list row
│   └── automations/
│       ├── SceneRow.tsx             # Morning/Night scene list row
│       └── TodaySceneCard.tsx       # Colored scene grid card
├── constants/
│   ├── Colors.ts                    # Color tokens (above)
│   ├── Devices.ts                   # Mock device data
│   ├── Rooms.ts                     # Mock room data
│   └── Scenes.ts                    # Mock scene data
├── hooks/
│   ├── useDevices.ts                # Device state + toggle logic
│   └── useAppState.ts               # Global app state (user, home)
├── types/
│   └── index.ts                     # TypeScript interfaces
├── assets/
│   ├── images/
│   │   ├── onboarding-1.jpg         # "Convenience" slide BG
│   │   ├── onboarding-2.jpg         # "Stay informed" slide BG
│   │   ├── onboarding-3.jpg         # "Automate" slide BG
│   │   ├── bedroom.jpg
│   │   ├── living-room.jpg
│   │   ├── study-room.jpg
│   │   └── guest-room.jpg
│   └── animations/
│       └── success-check.json       # Lottie checkmark animation
├── tailwind.config.js
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## Screen Specifications

### 1. Onboarding (`app/onboarding.tsx`)
- Full-screen `FlatList` horizontal, `pagingEnabled`
- Each slide: `ImageBackground` fullscreen, dark overlay at bottom (`rgba(0,0,0,0.5)`)
- Bottom content: Bold title (e.g. "Convenience"), subtitle text, 3 dot indicators, circular arrow FAB button (blue `#3B6FF0`)
- Skip button: top-right, absolute positioned, white text
- Slide 2 & 3: mosaic grid of 4 images over background (use `View` grid with `Image` components)
- Animation: slides fade in with `Reanimated.FadeInRight`, dots animate with `Animated.spring`
- After last slide → navigate to `(auth)/welcome`

### 2. Welcome (`app/(auth)/welcome.tsx`)
- Background: blurred/layered room cards visible behind bottom sheet effect
- App name: "Smart**Home**" — "Smart" in white bold, "Home" in `#EF9F27` amber bold
- Subtitle tagline below
- Large yellow chair illustration (use Image asset)
- Buttons at bottom: "Create a account" (primary blue), "Sign In" (outline), social row (Facebook, Google, Twitter)

### 3. Sign In (`app/(auth)/sign-in.tsx`)
- Black bg, back arrow header
- "Sign In" heading + subtitle
- Email input, Password input (with eye toggle), "Forgot Password?" in red
- Primary "Sign In" button
- "Or" divider
- Social buttons: Facebook, Google (icon-only rounded squares, dark bg)

### 4. Sign Up (`app/(auth)/sign-up.tsx`)
- Same layout as Sign In
- Fields: Full Name, Email, Phone Number (with country code + X clear), Password
- Terms checkbox: "I accept terms & conditions"
- "Sign Up" primary button
- On success → show Congratulations bottom sheet modal (Lottie checkmark + "Get Started")

### 5. Home (`app/(tabs)/index.tsx`)
- Header: hamburger icon left, bell icon right
- Greeting: Avatar + "Hi, [Name]" + "Welcome back to your smart Home."
- "My Rooms" section with "+ Add New" — 2-col `FlatList` of `RoomCard`
  - Each card: background image, room name bold, device count muted, pastel bg tint
  - Rooms: Bed Room (pink tint), Living Room (blue tint), Study Room (yellow tint), Guest Room (gray tint)
- "Frequently Used" section with "See All" — vertical list of `DeviceToggleRow`
  - Active row: blue bg, white text, toggle ON
  - Inactive row: dark bg, white text, toggle OFF
- Bottom tab bar (5 tabs)

### 6. Room Detail / Device List (`components` used from home)
- Header: "Device List" + 3-dot menu
- Horizontal room filter pills (Bed Room, Kitchen Room, Living Room...)
- Room photo header image
- "Devices" section + "+ Add New" — 2x2 grid of `DeviceCard`
  - Active: blue bg, device icon, name, toggle ON
  - Inactive: dark bg, device icon, name, toggle OFF
- "Frequently Used" list below grid (same as home)

### 7. Add Device Flow (Bottom Sheets)
**Step 1** — Camera view + "Scan Code" / "Connect via WiFi or Bluetooth" options + Continue
**Step 2 (bottom sheet)** — "Add Device" list with radio buttons (Lamp Light, Homepod, Ceiling Fan, Air Condition) + Continue
**Step 3 (bottom sheet)** — "Add Photos" 2x2 image grid + "Take New Photo" + Continue
**Step 4 (bottom sheet)** — "Device Name" text input + Continue/Cancel
**Step 5 (bottom sheet)** — "Select Room" chip grid (multi-select, selected = blue with X) + "Add Now"
**Success modal** — Lottie checkmark + "Congratulations! Master Bedroom Added!" + "Home" button

### 8. Device Screen (`app/(tabs)/device.tsx`)
- Header: hamburger + bell, title "Device"
- Circular temperature dial (custom SVG or `react-native-circular-slider`)
  - Blue arc on dark circle, draggable thumb
  - Center: large temp number + "Room Temp"
  - Scale labels: 20°, 40°, 00°, 30° around dial
- Device cards grid below (Air Condition active blue, Lamp Light inactive dark)
- Bottom tab bar

### 9. Device Control — AC (`screens/DeviceControlAC`)
- Room filter pills at top
- Title "Lamp Light" / device name + location + power button (blue circle, right)
- Same circular dial as Device screen
- "Select Mood" section: Cool / Heat / Wind / Auto icon buttons (active = blue bg)
- "Set Timer" outline button at bottom

### 10. Device Control — Light (`screens/DeviceControlLight`)
- Room filter pills
- Device name + power button
- Large lamp image in dark rounded card
- "Color" label + color wheel icon (opens color picker)
- "Tone Glow" segmented: Warm | Cold
- "Intensity" slider (0–100%, blue track, shows %)
- "Set Schedule" button → opens Change Color bottom sheet (8 color circle options)

### 11. Automations (`app/(tabs)/automations.tsx`)
- Header: hamburger + bell, title "Automations"
- "Scenes" section + "+ Add New" → Add a Scene bottom sheet
  - Suggested Scenes: Morning scene, Night scene rows
  - "Create New" primary button
  - Create New flow: Scene Name input + "Schedule?" Yes/No → Continue → Add Device bottom sheet
- "Today's Scenes" section + "+ Add New" — 2x2 grid of `TodaySceneCard`
  - Rise n' Shine: blue bg, sun icon, 7:00 am Everyday
  - House Keeping: dark bg, 10:00 am Everyday
  - Movie Night: dark bg, 07:00 pm Fri, Sat
  - Good Night: pink/rose bg, moon icon, 9:00 pm Everyday

### 12. Statistic (`app/(tabs)/statistic.tsx`)
- Header: hamburger + bell, title "Statistic"
- Top stat row: `$170.00 Cost` | `99 kWh Usage` (dark card, icon left)
- "Activities" section + Daily dropdown
- Bar chart (7 days, active bar = blue with label tooltip "99 kWh", others = dark gray)
  - X-axis: Fri Sat Sun Mon Tue Wed
  - Active: Sun (highlighted blue)
- "Device Power Consumption" list:
  - Each row: device icon (colored circle) + name + device count + kWh used right
  - Ceiling light: 120 kWh / Homepod: 20 kWh / Ceiling Fan: 120 kWh

### 13. Camera (`app/(tabs)/camera.tsx`)
- Header: hamburger + bell, title "Real Time"
- Large room preview image (active camera feed) with timestamp overlays (top-left + top-right)
- "Cameras" section + "+ Add New"
- Camera list rows: thumbnail + room name + floor + date + time
  - Active row: blue bg (Bed Room)
  - Inactive: dark bg

### 14. Away Mode (`screens/Away.tsx`)
- Full black screen
- "Have a good day" title top
- Circle illustration (car driving away, sunny)
- Lock icon badge below circle
- Body text: "Your home is now secure and conserving energy while you are away."
- "At Home" primary button
- "Watch CC Camera" outline button

### 15. Profile Edit (`screens/ProfileEdit.tsx`)
- Back arrow + "Profile Edit" title + 3-dot menu
- Avatar with blue ring + pencil edit badge (bottom-right)
- Name + email below avatar
- Form fields: Name, Email, Address, Home Name
- Cancel (outline) + Save (primary) buttons at bottom

---

## Animation Specifications

| Element | Animation | Library |
|---|---|---|
| Onboarding slide transition | `FadeInRight` / `FadeOutLeft` | Reanimated |
| Dot indicator active | `spring` scale 1 → 1.4 | Reanimated |
| Bottom sheet open | `SlideInDown` 300ms | Reanimated |
| Device toggle | `spring` with bounce | Reanimated |
| Room card press | `scale(0.97)` press feedback | Reanimated |
| Success checkmark | Lottie JSON animation | lottie-react-native |
| Circular dial thumb drag | `PanGestureHandler` | Reanimated + RNGH |
| Tab switch | `FadeIn` 150ms | Reanimated |
| Stats bar chart | Count-up on mount | react-native-gifted-charts |

---

## Mock Data

### Devices
```ts
export const DEVICES = [
  { id: '1', name: 'Air Condition', icon: 'snow', status: 'Connected', isOn: true, kwhPerHour: 2, room: 'Bed Room' },
  { id: '2', name: 'Lamp Light', icon: 'bulb-outline', status: 'Disconnected', isOn: false, kwhPerHour: 2, room: 'Bed Room' },
  { id: '3', name: 'Ceiling Fan', icon: 'aperture', status: 'Disconnected', isOn: false, kwhPerHour: 2, room: 'Bed Room' },
  { id: '4', name: 'Homepod Mini', icon: 'radio', status: 'Disconnected', isOn: false, kwhPerHour: 2, room: 'Living Room' },
  { id: '5', name: 'CC Camera', icon: 'videocam-outline', status: 'Connected', isOn: true, kwhPerHour: 2, room: 'Living Room' },
  { id: '6', name: 'Security Lock', icon: 'lock-closed-outline', status: 'Connected', isOn: true, kwhPerHour: 2, room: 'Living Room' },
]
```

### Rooms
```ts
export const ROOMS = [
  { id: '1', name: 'Bed Room', deviceCount: 5, totalDevices: 8, image: require('@/assets/images/bedroom.jpg'), tintColor: '#FDE8E8' },
  { id: '2', name: 'Living Room', deviceCount: 2, totalDevices: 6, image: require('@/assets/images/living-room.jpg'), tintColor: '#E8F0FD' },
  { id: '3', name: 'Study Room', deviceCount: 1, totalDevices: 4, image: require('@/assets/images/study-room.jpg'), tintColor: '#FDF6E8' },
  { id: '4', name: 'Guest Room', deviceCount: 2, totalDevices: 5, image: require('@/assets/images/guest-room.jpg'), tintColor: '#F0EDF8' },
]
```

### Scenes
```ts
export const SCENES = [
  { id: '1', name: 'Rise n\' Shine', time: '7:00 am', repeat: 'Everyday', icon: 'sunny', color: '#3B6FF0', status: 'Scheduled' },
  { id: '2', name: 'House Keeping', time: '10:00 am', repeat: 'Everyday', icon: 'construct', color: '#1A1A1A', status: 'Scheduled' },
  { id: '3', name: 'Movie Night', time: '07:00 pm', repeat: 'Fri, Sat', icon: 'film', color: '#1A1A1A', status: 'Scheduled' },
  { id: '4', name: 'Good Night', time: '9:00 pm', repeat: 'Everyday', icon: 'moon', color: '#C97E8A', status: 'Scheduled' },
]
```

---

## TypeScript Interfaces

```ts
// types/index.ts

export interface Device {
  id: string
  name: string
  icon: string
  status: 'Connected' | 'Disconnected'
  isOn: boolean
  kwhPerHour: number
  room: string
  type?: 'ac' | 'light' | 'fan' | 'speaker' | 'camera' | 'lock'
}

export interface Room {
  id: string
  name: string
  deviceCount: number
  totalDevices: number
  image: any
  tintColor: string
}

export interface Scene {
  id: string
  name: string
  time: string
  repeat: string
  icon: string
  color: string
  status: 'Scheduled' | 'Active'
  devices?: Device[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  homeName: string
  address: string
}
```

---

## Install Commands

```bash
npx create-expo-app nestiq --template blank-typescript
cd nestiq

# Core dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# NativeWind
npm install nativewind
npm install --save-dev tailwindcss@3.3.2

# Animations
npx expo install react-native-reanimated react-native-gesture-handler moti

# Icons
npx expo install @expo/vector-icons

# Image & Media
npx expo install expo-image-picker expo-camera

# Lottie
npx expo install lottie-react-native

# Charts
npm install react-native-gifted-charts react-native-linear-gradient

# Font
npx expo install expo-font @expo-google-fonts/poppins
```

---

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B6FF0',
        surface: '#1A1A1A',
        surfaceAlt: '#242424',
        border: '#2A2A2A',
      }
    },
  },
  plugins: [],
}
```

---

## babel.config.js

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
```

---

## Claude Code Prompt (paste this to start)

```
I'm building NestIQ — a Smart Home IoT mobile app using Expo + React Native + NativeWind + Reanimated.

Read this CLAUDE.md file first for all design tokens, screen specs, component structure, mock data, and animation requirements before writing any code.

Start with this order:
1. Run the install commands from CLAUDE.md
2. Set up tailwind.config.js and babel.config.js exactly as specified
3. Create the full folder structure (all files, even if empty with a comment placeholder)
4. Build constants/Colors.ts, constants/Devices.ts, constants/Rooms.ts, constants/Scenes.ts, types/index.ts
5. Build the reusable UI components in components/ui/ (Button, Card, BottomSheet, DeviceToggleRow, DeviceCard, RoomCard, RoomFilterPill, SceneCard, SectionHeader)
6. Build the Onboarding screen (app/onboarding.tsx) with full animations
7. Build the Auth screens (welcome, sign-in, sign-up) with the Congratulations success modal
8. Build the Home screen (app/(tabs)/index.tsx) with all sections
9. Build remaining tab screens one by one

Follow the design system strictly — dark background #0A0A0A, cards #1A1A1A, primary blue #3B6FF0. Every screen must match the Figma designs described in CLAUDE.md.
```