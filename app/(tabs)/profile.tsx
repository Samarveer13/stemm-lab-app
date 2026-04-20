import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import CustomButton from "../../src/components/CustomButton";

export default function ProfileScreen() {
  const router = useRouter();

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
              color: "#3B82F6",
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
              color: "#1F2937",
            }}
          >
            Student Profile
          </Text>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              Mahnoor
            </Text>

            <Text style={{ color: "#6B7280", marginBottom: 6 }}>
              Year 8
            </Text>

            <Text style={{ color: "#6B7280", marginBottom: 6 }}>
              Team: STEMM Explorers
            </Text>

            <Text style={{ color: "#6B7280", marginBottom: 6 }}>
              Experiments Completed: 6
            </Text>

            <Text style={{ color: "#6B7280" }}>
              Total Score: 120
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontWeight: "600", marginBottom: 10 }}>
              Leaderboard
            </Text>

            <Text style={{ color: "#6B7280", marginBottom: 4 }}>
              1. Team Alpha — 150 pts
            </Text>

            <Text style={{ color: "#6B7280", marginBottom: 4 }}>
              2. Team Beta — 120 pts
            </Text>

            <Text style={{ color: "#6B7280" }}>
              3. Team Charlie — 100 pts
            </Text>

            <Text
              style={{
                marginTop: 10,
                color: "#3B82F6",
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