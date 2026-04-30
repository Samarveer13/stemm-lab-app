import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import CustomButton from "../../src/components/CustomButton";
import ScreenContainer from "../../src/components/ScreenContainer";
import { useAccessibility } from "../../src/context/AccessibilityContext";
import { useAuth } from "../../src/context/AuthContext";
import { getUserLocation } from "../../src/services/locationService";

export default function ProfileScreen() {
  const router = useRouter();
  const { studentName, teamName, yearLevel } = useAuth();
  const { colors, fontSize, fontFamily } = useAccessibility();

  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    getUserLocation().then(setLocation);
  }, []);

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
              fontSize: fontSize + 4,
              color: colors.primary,
              fontWeight: "600",
              fontFamily,
              marginBottom: 30,
            }}
          >
            STEMM Lab
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: fontSize + 8,
              fontWeight: "700",
              fontFamily,
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
            <Text style={{ fontSize: fontSize + 4, fontWeight: "600", fontFamily, marginBottom: 8, color: colors.textMain }}>
              {studentName || "Student"}
            </Text>

            <Text style={{ fontSize, fontFamily, color: colors.textSub, marginBottom: 6 }}>
              {yearLevel || "—"}
            </Text>

            <Text style={{ fontSize, fontFamily, color: colors.textSub, marginBottom: 6 }}>
              Team: {teamName || "—"}
            </Text>

            <Text style={{ fontSize, fontFamily, color: colors.textSub, marginBottom: 6 }}>
              Experiments Completed: 6
            </Text>

            <Text style={{ fontSize, fontFamily, color: colors.textSub, marginBottom: 6 }}>
              Total Score: 120
            </Text>

            {}
            <Text style={{ fontSize, fontFamily, color: colors.textSub }}>
              Location:{" "}
              {location
                ? `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`
                : "Fetching..."}
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
            <Text style={{ fontSize, fontWeight: "600", fontFamily, marginBottom: 10, color: colors.textMain }}>
              Leaderboard
            </Text>

            <Text style={{ fontSize, fontFamily, color: colors.textSub, marginBottom: 4 }}>
              1. Team Alpha — 150 pts
            </Text>

            <Text style={{ fontSize, fontFamily, color: colors.textSub, marginBottom: 4 }}>
              2. Team Beta — 120 pts
            </Text>

            <Text style={{ fontSize, fontFamily, color: colors.textSub }}>
              3. Team Charlie — 100 pts
            </Text>

            <Text
              style={{
                marginTop: 10,
                fontSize,
                fontFamily,
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