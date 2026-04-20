import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AccessibilityProvider } from "../src/context/AccessibilityContext";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </AccessibilityProvider>
  );
}
