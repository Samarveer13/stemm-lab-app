import { TouchableOpacity, Text } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useAccessibility } from "../context/AccessibilityContext";

type Props = {
  title: string;
  onPress?: () => void;
};

export default function CustomButton({ title, onPress }: Props) {
  const { colors, fontSize, fontFamily } = useAccessibility();

  return (
    <TouchableOpacity
      style={[commonStyles.button, { backgroundColor: colors.primary }]}
      onPress={onPress}
    >
      <Text
        style={[
          commonStyles.buttonText,
          { fontSize, fontFamily },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
