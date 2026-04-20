import React, { createContext, useContext, useMemo, useState } from "react";

export type TextStyle = "default" | "serif" | "mono";
export type TextSize = "small" | "medium" | "large" | "xlarge";

export interface ThemeColors {
  bg: string;
  card: string;
  border: string;
  textMain: string;
  textSub: string;
  primary: string;
  primarySelected: string;
  toggleTrack: string;
  sectionLabel: string;
}

export const FONT_FAMILY_MAP: Record<TextStyle, string | undefined> = {
  default: undefined,
  serif: "Georgia",
  mono: "Courier New",
};

export const FONT_SIZE_MAP: Record<TextSize, number> = {
  small: 12,
  medium: 14,
  large: 17,
  xlarge: 20,
};

function buildColors(darkMode: boolean, highContrast: boolean): ThemeColors {
  if (darkMode && highContrast) {
    return {
      bg: "#000000",
      card: "#0D0D0D",
      border: "#FFFFFF",
      textMain: "#FFFFFF",
      textSub: "#FFFFFF",
      primary: "#FFD700",
      primarySelected: "#3D3000",
      toggleTrack: "#FFD700",
      sectionLabel: "#FFD700",
    };
  }
  if (darkMode) {
    return {
      bg: "#111827",
      card: "#1F2937",
      border: "#374151",
      textMain: "#F9FAFB",
      textSub: "#9CA3AF",
      primary: "#60A5FA",
      primarySelected: "#1E3A5F",
      toggleTrack: "#3B82F6",
      sectionLabel: "#9CA3AF",
    };
  }
  if (highContrast) {
    return {
      bg: "#FFFFFF",
      card: "#F0F0F0",
      border: "#000000",
      textMain: "#000000",
      textSub: "#000000",
      primary: "#0000CC",
      primarySelected: "#CCCCFF",
      toggleTrack: "#0000CC",
      sectionLabel: "#000000",
    };
  }
  return {
    bg: "#F4F6F8",
    card: "#FFFFFF",
    border: "#E5E7EB",
    textMain: "#1F2937",
    textSub: "#6B7280",
    primary: "#3B82F6",
    primarySelected: "#EFF6FF",
    toggleTrack: "#3B82F6",
    sectionLabel: "#6B7280",
  };
}

interface AccessibilitySettings {
  darkMode: boolean;
  highContrast: boolean;
  textStyle: TextStyle;
  textSize: TextSize;
  setDarkMode: (v: boolean) => void;
  setHighContrast: (v: boolean) => void;
  setTextStyle: (v: TextStyle) => void;
  setTextSize: (v: TextSize) => void;
  // Derived — ready to use in any screen
  colors: ThemeColors;
  fontSize: number;
  fontFamily: string | undefined;
}

const AccessibilityContext = createContext<AccessibilitySettings>({
  darkMode: false,
  highContrast: false,
  textStyle: "default",
  textSize: "medium",
  setDarkMode: () => {},
  setHighContrast: () => {},
  setTextStyle: () => {},
  setTextSize: () => {},
  colors: buildColors(false, false),
  fontSize: FONT_SIZE_MAP.medium,
  fontFamily: undefined,
});

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textStyle, setTextStyle] = useState<TextStyle>("default");
  const [textSize, setTextSize] = useState<TextSize>("medium");

  const colors = useMemo(() => buildColors(darkMode, highContrast), [darkMode, highContrast]);
  const fontSize = FONT_SIZE_MAP[textSize];
  const fontFamily = FONT_FAMILY_MAP[textStyle];

  return (
    <AccessibilityContext.Provider
      value={{
        darkMode, setDarkMode,
        highContrast, setHighContrast,
        textStyle, setTextStyle,
        textSize, setTextSize,
        colors,
        fontSize,
        fontFamily,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);
