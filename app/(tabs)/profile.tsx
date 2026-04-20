import { Text, View } from "react-native";
import ScreenContainer from "../../src/components/ScreenContainer";

export default function ProfileScreen() {
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
      </View>
    </ScreenContainer>
  );
}