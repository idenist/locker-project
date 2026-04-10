import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { Text } from "react-native-paper";
import styles from "../../styles/lockerDetailStyles";
import { createKakaoMapHTML } from "../../utils/mapHtml";

export default function LockerMap({
  latitude,
  longitude,
  title,
  address,
  kakaoMapKey,
  hasValidCoords,
}) {
  const handleOpenExternalMap = () => {
    if (!hasValidCoords) return;

    const url = `https://map.kakao.com/link/map/${encodeURIComponent(
      title || "물품보관함"
    )},${latitude},${longitude}`;

    Linking.openURL(url);
  };

  if (!hasValidCoords) {
    return (
      <View style={styles.mapFallback}>
        <Text style={styles.mapFallbackText}>위치 정보가 없습니다.</Text>
      </View>
    );
  }

  return (
    <>
      <WebView
        style={styles.map}
        originWhitelist={["*"]}
        source={{
          html: createKakaoMapHTML({
            lat: latitude,
            lng: longitude,
            title,
            address,
            appKey: kakaoMapKey,
          }),
        }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
      />

      <TouchableOpacity style={styles.mapButton} onPress={handleOpenExternalMap}>
        <Text style={styles.mapButtonText}>카카오맵에서 열기</Text>
      </TouchableOpacity>
    </>
  );
}