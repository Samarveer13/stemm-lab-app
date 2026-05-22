import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccessibility } from "../context/AccessibilityContext";

type Props = {
  children: ReactNode;
};

export default function ScreenContainer({ children }: Props) {
  const { colors } = useAccessibility();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.bg }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
