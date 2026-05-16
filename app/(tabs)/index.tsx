import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import { useAccessibility } from "../../src/context/AccessibilityContext";
import { useAuth } from "../../src/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, fontSize, fontFamily } = useAccessibility();
  const { teamName, teamCode, memberNames, logout } = useAuth();

  const t = (size: number, extra?: object) => ({
    fontSize: size + (fontSize - 14),
    fontFamily,
    ...extra,
  });

  return (
    <ScreenContainer>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>

        {/* Top bar */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 60, marginBottom: 8 }}>
          <Text style={{ ...t(17), color: colors.primary, fontWeight: "700", letterSpacing: 0.5 }}>
            STEMM Lab
          </Text>
          <TouchableOpacity
            onPress={logout}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Text style={{ ...t(12), color: colors.textSub, fontWeight: "600" }}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* Hero section */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 40 }}>

          {/* Icon circle */}
          <View style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: colors.primary + "18",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}>
            <Text style={{ fontSize: 40 }}>🔬</Text>
          </View>

          {/* Welcome heading */}
          <Text style={{ ...t(28), fontWeight: "800", color: colors.textMain, textAlign: "center", marginBottom: 6, letterSpacing: -0.5 }}>
            Welcome back,
          </Text>
          <Text style={{ ...t(28), fontWeight: "800", color: colors.primary, textAlign: "center", marginBottom: 20, letterSpacing: -0.5 }}>
            {teamName || "Team"}
          </Text>

          {/* Team info pill */}
          {!!teamCode && (
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 7,
              marginBottom: 10,
              gap: 6,
            }}>
              <Text style={{ ...t(12), color: colors.textSub }}>Team Code</Text>
              <View style={{ width: 1, height: 12, backgroundColor: colors.border }} />
              <Text style={{ ...t(12), color: colors.primary, fontWeight: "700", letterSpacing: 1 }}>
                {teamCode}
              </Text>
            </View>
          )}

          {/* Member count */}
          {memberNames.length > 0 && (
            <Text style={{ ...t(13), color: colors.textSub, marginBottom: 44 }}>
              {memberNames.length} member{memberNames.length !== 1 ? "s" : ""}
            </Text>
          )}

          {!memberNames.length && <View style={{ marginBottom: 44 }} />}

          {/* Primary CTA */}
          <TouchableOpacity
            onPress={() => router.push("/activity-hub")}
            activeOpacity={0.85}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 18,
              paddingHorizontal: 40,
              borderRadius: 16,
              width: "100%",
              alignItems: "center",
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
              marginBottom: 16,
            }}
          >
            <Text style={{ ...t(16), color: "#fff", fontWeight: "700", letterSpacing: 0.3 }}>
              Start Activity
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScreenContainer>
  );
}
