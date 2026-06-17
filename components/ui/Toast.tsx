import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type ToastType = 'info' | 'success' | 'error' | 'warning';

type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

type ToastState = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  show: (message: string, opts?: ToastOptions) => void;
  success: (message: string, opts?: ToastOptions) => void;
  error: (message: string, opts?: ToastOptions) => void;
  warning: (message: string, opts?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TYPE_THEME: Record<ToastType, { bg: string; icon: keyof typeof Ionicons.glyphMap; tint: string }> = {
  info: { bg: '#1A1A1A', icon: 'information-circle', tint: '#3B6FF0' },
  success: { bg: '#1A1A1A', icon: 'checkmark-circle', tint: '#3FBF7F' },
  error: { bg: '#1A1A1A', icon: 'alert-circle', tint: '#E24B4A' },
  warning: { bg: '#1A1A1A', icon: 'warning', tint: '#EF9F27' },
};

/**
 * Lightweight bottom-anchored toast. One toast at a time — a new `show` replaces
 * whatever's on screen rather than queueing, which is the right call for a
 * single-user dashboard where bursts of unrelated messages would be noise.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 160, easing: Easing.in(Easing.cubic) });
    translateY.value = withTiming(20, { duration: 160 }, (finished) => {
      if (finished) runOnJS(setToast)(null);
    });
  }, [opacity, translateY]);

  const show = useCallback(
    (message: string, opts?: ToastOptions) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const next: ToastState = {
        id: Date.now(),
        message,
        type: opts?.type ?? 'info',
      };
      setToast(next);
      opacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
      timerRef.current = setTimeout(dismiss, opts?.duration ?? 2600);
    },
    [opacity, translateY, dismiss],
  );

  const api = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (m, o) => show(m, { ...o, type: 'success' }),
      error: (m, o) => show(m, { ...o, type: 'error' }),
      warning: (m, o) => show(m, { ...o, type: 'warning' }),
    }),
    [show],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? (
        <SafeAreaView
          pointerEvents="none"
          edges={['bottom']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: TYPE_THEME[toast.type].bg,
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 6 },
                elevation: 8,
              },
              animatedStyle,
            ]}
          >
            <Ionicons
              name={TYPE_THEME[toast.type].icon}
              size={20}
              color={TYPE_THEME[toast.type].tint}
            />
            <Text
              style={{
                color: '#FFFFFF',
                marginLeft: 10,
                fontSize: 14,
                flex: 1,
              }}
              numberOfLines={2}
            >
              {toast.message}
            </Text>
          </Animated.View>
        </SafeAreaView>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
