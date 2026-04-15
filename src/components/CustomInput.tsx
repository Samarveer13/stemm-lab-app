import { TextInput } from "react-native";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
}: Props) {
  return (
    <TextInput
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: "#D1D5DB",
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 14,
        fontSize: 15,
        color: "#111827",
      }}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
    />
  );
}