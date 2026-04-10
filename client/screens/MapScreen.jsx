import { View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { createKakaoFullMapHTML } from "../utils/createKakaoFullMapHTML";
import { styles } from "../styles/homeScreenStyles"

export default function MapScreen({ route, navigation }) {
  const { lockers, currentLocation } = route.params;
  const kakaoMapKey = process.env.EXPO_PUBLIC_KAKAO_MAP_JS_KEY;
  const insets = useSafeAreaInsets();

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "locker_detail") {
        navigation.navigate("LockerDetail", {
          locker: {
            stdgCd: data.stdgCd,
            stlckId: data.stlckId,
          },
        });
      }
    } catch (error) {
      console.error("WebView message parse error:", error);
    }
  };

  const html = createKakaoFullMapHTML({
    kakaoMapKey,
    currentLocation,
    lockers,
  });

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ flex: 1 }}
        onMessage={handleMessage}
      />
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          contentStyle={styles.mapButtonContent}
          labelStyle={styles.mapButtonLabel}
          buttonColor="#111827"
        >
          뒤로가기
        </Button>
      </View>
    </SafeAreaView>
  );
}