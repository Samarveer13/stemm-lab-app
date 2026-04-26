import { Text, TouchableOpacity } from "react-native";
import { useMessage } from "../context/MessageContext";

export default function BroadcastBanner() {
  const { message, clearMessage } = useMessage();

  if (!message) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={clearMessage}
      style={{
        backgroundColor: "#EFF6FF",
        borderColor: "#3B82F6",
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 20,
        marginTop: 12,
      }}
    >
      <Text
        style={{
          color: "#1F2937",
          fontSize: 14,
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        {message}
      </Text>
    </TouchableOpacity>
  );
}