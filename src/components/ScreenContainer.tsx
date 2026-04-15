import { ReactNode } from "react";
import { SafeAreaView, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";

type Props = {
  children: ReactNode;
};

export default function ScreenContainer({ children }: Props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={commonStyles.screen}>{children}</View>
    </SafeAreaView>
  );
}