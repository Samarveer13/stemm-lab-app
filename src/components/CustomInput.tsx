import { TextInput, TextInputProps } from "react-native";
import { useAccessibility } from "../context/AccessibilityContext";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
} & Pick<TextInputProps, "secureTextEntry" | "keyboardType" | "autoCapitalize" | "autoComplete">;

export default function CustomInput({ placeholder, value, onChangeText, ...rest }: Props) {
  const { colors, fontSize, fontFamily } = useAccessibility();

  return (
    <TextInput
      style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: colors.border,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 14,
        fontSize,
        fontFamily,
        color: colors.textMain,
      }}
      placeholder={placeholder}
      placeholderTextColor={colors.textSub}
      value={value}
      onChangeText={onChangeText}
      {...rest}
    />
  );
}
