declare module 'nativewind' {
  import type { ComponentType } from 'react';
  import type { ViewProps, TextProps, TouchableOpacityProps } from 'react-native';

  type WithClassName<T> = T & { className?: string };

  export function styled<T extends ComponentType<any>>(
    component: T
  ): ComponentType<WithClassName<ComponentProps<T>>>;
} 