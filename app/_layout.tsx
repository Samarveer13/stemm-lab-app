import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AccessibilityProvider } from "../src/context/AccessibilityContext";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { MessageProvider } from "../src/context/MessageContext";
import BroadcastBanner from "../src/components/BroadcastBanner";
import { registerStemmBackgroundTask } from "../src/services/backgroundTaskService";

function RootNavigator() {
  const { user, loading, teamReady } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    registerStemmBackgroundTask();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTeamSetup = segments[0] === "team-setup";
    const inTabs = segments[0] === "(tabs)";
    const inActivities = segments[0] === "activities";

    if (!user) {
      if (!inAuthGroup) router.replace("/(auth)/login");
    } else if (!teamReady) {
      if (!inTeamSetup) router.replace("/team-setup");
    } else {
      if (!inTabs && !inActivities) router.replace("/(tabs)");
    }
  }, [user, loading, teamReady, segments]);

  return (
    <>
      <BroadcastBanner />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <MessageProvider>
          <RootNavigator />
        </MessageProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}