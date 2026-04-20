import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AccessibilityProvider } from "../src/context/AccessibilityContext";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

function RootNavigator() {
  const { user, loading, teamReady } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTeamSetup = segments[0] === "team-setup";
    const inTabs = segments[0] === "(tabs)";
    const inActivities = segments[0] === "activities";

    if (!user) {
      // Not logged in → go to login
      if (!inAuthGroup) router.replace("/(auth)/login");
    } else if (!teamReady) {
      // Logged in but team not set up yet
      if (!inTeamSetup) router.replace("/team-setup");
    } else {
      // Fully authenticated + team ready
      if (!inTabs && !inActivities) router.replace("/(tabs)");
    }
  }, [user, loading, teamReady, segments]);

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
