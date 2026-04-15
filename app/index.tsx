import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../src/components/ScreenContainer";
import CustomButton from "../src/components/CustomButton";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#3B82F6",
            fontWeight: "600",
            marginBottom: 50,
          }}
        >
          STEMM Lab
        </Text>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#1F2937",
            marginBottom: 15,
          }}
        >
          Welcome!
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: "#1F2937",
            marginBottom: 20,
          }}
        >
          To STEMM Lab
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#9CA3AF",
            marginBottom: 50,
          }}
        >
          Learn, Experiment, Compete.
        </Text>

        <View style={{ width: "85%" }}>
          <CustomButton
            title="Get Started"
            onPress={() => router.push("/team-setup")}
          />
        </View>

        <Text
          style={{
            fontSize: 13,
            color: "#D1D5DB",
            marginTop: 20,
          }}
        >
          Start your STEMM journey
        </Text>
      </View>
    </ScreenContainer>
  );
}