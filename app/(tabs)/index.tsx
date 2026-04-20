import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import CustomButton from "../../src/components/CustomButton";
import { useAccessibility } from "../../src/context/AccessibilityContext";
import { useAuth } from "../../src/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, fontSize, fontFamily } = useAccessibility();
  const { user, logout, studentName } = useAuth();

  const t = (size: number, extra?: object) => ({
    fontSize: size + (fontSize - 14),
    fontFamily,
    ...extra,
  });

  async function handleLogout() {
    await logout();
  }

  return (
    <ScreenContainer>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 70 }}>
        {/* Header row */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
          <Text style={{ ...t(18), color: colors.primary, fontWeight: "600", flex: 1, textAlign: "center" }}>
            STEMM Lab
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
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
            <Text style={{ ...t(12), color: colors.textSub, fontWeight: "600" }}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            ...t(22),
            textAlign: "center",
            fontWeight: "700",
            marginBottom: 40,
            color: colors.textMain,
          }}
        >
          Welcome {studentName || user?.displayName || "Student"}
        </Text>

        <CustomButton
          title="Start Activity"
          onPress={() => router.push("/activity-hub")}
        />

        <CustomButton
          title="Upload Experiment"
          onPress={() => router.push("/activity-hub")}
        />

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 14,
            padding: 16,
            marginTop: 20,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ ...t(14), color: colors.textSub, marginBottom: 4 }}>
              Team Progress
            </Text>
            <Text style={{ ...t(13), color: colors.textSub }}>
              Experiments Completed: 6
            </Text>
          </View>

          <Text style={{ ...t(24), fontWeight: "700", color: colors.textMain }}>
            120
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
