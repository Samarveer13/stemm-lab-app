import { Stack } from "expo-router";
import { AccessibilityProvider } from "../src/context/AccessibilityContext";

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AccessibilityProvider>
  );
}