import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import CustomButton from "../../src/components/CustomButton";
import { useAuth } from "../../src/context/AuthContext";
import { useAccessibility } from "../../src/context/AccessibilityContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { studentName, teamName, yearLevel } = useAuth();
  const { colors } = useAccessibility();

  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 70,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: colors.primary,
              fontWeight: "600",
              marginBottom: 30,
            }}
          >
            STEMM Lab
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 30,
              color: colors.textMain,
            }}
          >
            Student Profile
          </Text>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: colors.textMain }}>
              {studentName || "Student"}
            </Text>

            <Text style={{ color: colors.textSub, marginBottom: 6 }}>
              {yearLevel || "—"}
            </Text>

            <Text style={{ color: colors.textSub, marginBottom: 6 }}>
              Team: {teamName || "—"}
            </Text>

            <Text style={{ color: colors.textSub, marginBottom: 6 }}>
              Experiments Completed: 6
            </Text>

            <Text style={{ color: colors.textSub }}>
              Total Score: 120
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontWeight: "600", marginBottom: 10, color: colors.textMain }}>
              Leaderboard
            </Text>

            <Text style={{ color: colors.textSub, marginBottom: 4 }}>
              1. Team Alpha — 150 pts
            </Text>

            <Text style={{ color: colors.textSub, marginBottom: 4 }}>
              2. Team Beta — 120 pts
            </Text>

            <Text style={{ color: colors.textSub }}>
              3. Team Charlie — 100 pts
            </Text>

            <Text
              style={{
                marginTop: 10,
                color: colors.primary,
                fontWeight: "600",
              }}
            >
              Your Team: 2nd Place 🎉
            </Text>
          </View>
        </View>

        <View style={{ paddingBottom: 10 }}>
          <CustomButton
            title="View Activities"
            onPress={() => router.push("/(tabs)/activity-hub")}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}