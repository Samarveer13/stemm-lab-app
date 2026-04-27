import { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useMessage } from "../context/MessageContext";

export default function BroadcastBanner() {
  const { message, sendMessage, clearMessage } = useMessage();

  useEffect(() => {
    const interval = setInterval(() => {
      if (globalThis.STEMM_MESSAGE) {
        sendMessage(globalThis.STEMM_MESSAGE);
        globalThis.STEMM_MESSAGE = null;
      }
    }, 600000); // set to 10 minutes, can change if testing needs to be done.

    return () => clearInterval(interval);
  }, []);

  if (!message) return null;

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