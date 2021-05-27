import {} from 'styled-components';

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
}

export const textSize = {
  xs: "10px",
  sm: "12px",
  md: "14px",
  lg: "18px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
}

export const color = {
  background: {
    feature: {
      primary: "#28646e",
    },
    primary: "#fff",
    secondary: "#f2f2f2",
    image: {
      placeholder: "#d8d8d8",
    },
  },
  text: {
    feature: {
      highlight: {
        primary: "#50e3c2",
        secondary: "#aaf1e7",
      },
      primary: "#fff",
      secondary: "#a9c1c5"
    },
    primary: "#4a4a4a",
    secondary: "#9b9b9b",
  },
  separator: "#e6e6e6",
}

export const defaultTheme = {
  isDark: false,

  spacing,
  color,
  text: {
    size: textSize,
  },
};

declare module 'styled-components' {
  type Theme = typeof defaultTheme;
  export interface DefaultTheme extends Theme {}
}
