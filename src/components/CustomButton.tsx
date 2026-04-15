import { TouchableOpacity, Text } from "react-native";
import { commonStyles } from "../styles/commonStyles";

type Props = {
  title: string;
  onPress?: () => void;
};

export default function CustomButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={commonStyles.button} onPress={onPress}>
      <Text style={commonStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}