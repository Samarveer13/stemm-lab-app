import { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useMessage } from "../context/MessageContext";

export default function BroadcastBanner() {
  const { message, sendMessage, clearMessage } = useMessage();

  console.log("BroadcastBanner mounted");

  useEffect(() => {
    const interval = setInterval(() => {
      if (globalThis.STEMM_MESSAGE) {
        console.log("Banner received message:", globalThis.STEMM_MESSAGE);
        sendMessage(globalThis.STEMM_MESSAGE);
        globalThis.STEMM_MESSAGE = null;
      }
    }, 600000); //set to 10 minutes, can change if testing needs to be done

    return () => clearInterval(interval);
  }, [sendMessage]);

  if (!message) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={clearMessage}
      style={{
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        zIndex: 9999,
        elevation: 10,
        backgroundColor: "#EFF6FF",
        borderColor: "#3B82F6",
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
      }}
    >
      <Text
        style={{
          color: "#1F2937",
          fontSize: 14,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {message}
      </Text>
    </TouchableOpacity>
  );
}