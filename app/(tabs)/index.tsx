import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import CustomButton from "../../src/components/CustomButton";
import { useAccessibility } from "../../src/context/AccessibilityContext";

export default function HomeScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const { colors, fontSize, fontFamily } = useAccessibility();

  const text = (size: number, extra?: object) => ({
    fontSize: size + (fontSize - 14),
    fontFamily,
    ...extra,
  });

  return (
    <ScreenContainer>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 70 }}>
        <Text
          style={{
            ...text(18),
            textAlign: "center",
            color: colors.primary,
            fontWeight: "600",
            marginBottom: 30,
          }}
        >
          STEMM Lab
        </Text>

        <Text
          style={{
            ...text(22),
            textAlign: "center",
            fontWeight: "700",
            marginBottom: 40,
            color: colors.textMain,
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
            <Text style={{ ...text(14), color: colors.textSub, marginBottom: 4 }}>
              Team Progress
            </Text>
            <Text style={{ ...text(13), color: colors.textSub }}>
              Experiments Completed: 6
            </Text>
          </View>

          <Text
            style={{
              ...text(24),
              fontWeight: "700",
              color: colors.textMain,
            }}
          >
            120
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
