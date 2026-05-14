import { View, Text } from "react-native";

export default function AdBanner() {
  return (
    <View
      style={{
        marginTop: 20,
        marginHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#BFDBFE",
        backgroundColor: "#EFF6FF",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: "#1D4ED8",
          marginBottom: 4,
        }}
      >
        Sponsored STEM Content
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: "#6B7280",
        }}
      >
        Prototype AdMob Banner Placement
      </Text>
    </View>
  );
}