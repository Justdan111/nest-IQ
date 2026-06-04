import { Image, Text, View } from 'react-native';
import { initials } from '@/utils/initials';

type Props = {
  /** Avatar image URI (or `undefined` to render initials). */
  uri?: string;
  /** Display name — used to derive initials when no `uri`. */
  name: string;
  /** Outer circle size in px. */
  size?: number;
  /** Optional text size override; defaults scale with `size`. */
  fontSize?: number;
};

/**
 * Shared avatar — renders the uploaded image if `uri` is set, otherwise
 * shows the first one-or-two initials on the primary blue background.
 */
export function Avatar({ uri, name, size = 48, fontSize }: Props) {
  const computedFont = fontSize ?? Math.round(size * 0.4);
  return (
    <View
      className="rounded-full bg-primary items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Text
          className="text-white font-bold"
          style={{ fontSize: computedFont }}
        >
          {initials(name)}
        </Text>
      )}
    </View>
  );
}
