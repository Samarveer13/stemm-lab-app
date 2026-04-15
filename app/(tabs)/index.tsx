import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import CustomButton from "../../src/components/CustomButton";

export default function HomeScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 70,
        }}
      >
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
            marginBottom: 40,
            color: "#1F2937",
          }}
        >
          Welcome {name || "Student"}
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
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            padding: 16,
            marginTop: 20,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: "#6B7280", marginBottom: 4 }}>
              Team Progress
            </Text>
            <Text style={{ color: "#9CA3AF" }}>
              Experiments Completed: 6
            </Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#1F2937",
            }}
          >
            120
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}