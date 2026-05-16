import { View } from 'react-native';
import type { ViewProps } from 'react-native';

type Props = ViewProps & {
  active?: boolean;
};

export function Card({ active, className = '', style, children, ...rest }: Props) {
  const bg = active ? 'bg-[#3B6FF0]' : 'bg-[#1A1A1A]';
  return (
    <View
      className={`${bg} rounded-2xl p-4 ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </View>
  );
}
