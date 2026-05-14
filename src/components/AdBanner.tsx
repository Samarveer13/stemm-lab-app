import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { View } from "react-native";

export default function AdBanner() {
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 15,
      }}
    >
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}