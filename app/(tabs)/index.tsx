import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import CustomButton from "../../src/components/CustomButton";
import { useAccessibility } from "../../src/context/AccessibilityContext";
import { useAuth } from "../../src/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, fontSize, fontFamily } = useAccessibility();
  const { teamName, teamCode, logout } = useAuth();

  const t = (size: number, extra?: object) => ({
    fontSize: size + (fontSize - 14),
    fontFamily,
    ...extra,
  });

  return (
    <ScreenContainer>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 70 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
          <Text style={{ ...t(18), color: colors.primary, fontWeight: "600", flex: 1, textAlign: "center" }}>
            STEMM Lab
          </Text>
          <TouchableOpacity
            onPress={logout}
            style={{
              position: "absolute",
              right: 0,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
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

        <Text style={{ ...t(22), textAlign: "center", fontWeight: "700", marginBottom: 4, color: colors.textMain }}>
          Welcome, {teamName || "Team"}
        </Text>

        {!!teamCode && (
          <Text style={{ ...t(13), textAlign: "center", color: colors.textSub, marginBottom: 36 }}>
            Team Code: {teamCode}
          </Text>
        )}

        {!teamCode && <View style={{ marginBottom: 36 }} />}

        <CustomButton
          title="Start Activity"
          onPress={() => router.push("/activity-hub")}
        />

        <CustomButton
          title="Upload Experiment"
          onPress={() => router.push("/activity-hub")}
        />
      </View>
    </ScreenContainer>
  );
}
