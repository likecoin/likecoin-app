import {} from 'styled-components';

import { palette } from './palette';

export * from "./color"
export * from "./spacing"
export * from "./typography"
export * from "./timing"

export const defaultTheme = {
  isDark: false,

  palette,
};

declare module 'styled-components' {
  type Theme = typeof defaultTheme;
  export interface DefaultTheme extends Theme {}
}
