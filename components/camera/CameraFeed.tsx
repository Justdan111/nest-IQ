import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

type Props = {
  /** Local thumbnail / poster shown when no live stream is connected yet. */
  poster: ImageSourcePropType;
  /**
   * Optional live stream URL (HLS / RTSP). When wired up to a real feed, swap
   * the Image below for a Video player (expo-video / expo-av) and point it at
   * this URL. The structure of this component already accommodates that —
   * `streamUrl` flips the LIVE indicator and is the future source of truth.
   */
  streamUrl?: string;
  /** Camera label badge shown top-right (e.g. room name). */
  label?: string;
  /** Fixed height (omit to fill via flex — used by the fullscreen view). */
  height?: number;
  /** Skip the live indicator + clock overlays (useful for thumbnails). */
  hideOverlays?: boolean;
  /** Border radius (used on the inline hero feed). */
  borderRadius?: number;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function fmtElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function fmtClock(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Self-contained camera-feed surface. Renders the poster image today, but is
 * structured so a Video component can drop in unchanged once a real stream is
 * available. Overlays (LIVE pill, elapsed time, wall clock) tick every second.
 */
export function CameraFeed({
  poster,
  streamUrl,
  label,
  height,
  hideOverlays,
  borderRadius = 0,
}: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [clock, setClock] = useState(() => fmtClock(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((e) => e + 1);
      setClock(fmtClock(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const isLive = Boolean(streamUrl);

  return (
    <View
      style={{
        width: '100%',
        height,
        flex: height ? undefined : 1,
        backgroundColor: '#000',
        overflow: 'hidden',
        borderRadius,
      }}
    >
      {/*
        When a real stream URL is set, render the live feed here. Example:

        <Video
          source={{ uri: streamUrl }}
          shouldPlay
          isLooping
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
        />

        Until then the poster image stands in.
      */}
      <Image
        source={poster}
        resizeMode="cover"
        style={{ width: '100%', height: '100%' }}
      />

      {!hideOverlays ? (
        <>
          <View
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.55)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: isLive ? '#E24B4A' : '#8A8A8A',
                marginRight: 6,
              }}
            />
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
              {isLive ? 'LIVE' : 'PLAYBACK'}
            </Text>
          </View>

          {label ? (
            <View
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: 'rgba(0,0,0,0.55)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '500' }}>
                {label}
              </Text>
            </View>
          ) : null}

          <View style={{ position: 'absolute', bottom: 12, left: 14 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '700',
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowRadius: 4,
              }}
            >
              {fmtElapsed(elapsed)}
            </Text>
          </View>
          <View style={{ position: 'absolute', bottom: 12, right: 14 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '700',
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowRadius: 4,
              }}
            >
              {clock}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}
