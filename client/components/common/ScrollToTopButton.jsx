import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScrollToTopButton({
  visible,
  onPress,
  bottomOffset = 0,
}) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { bottom: insets.bottom + bottomOffset },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="arrow-up" size={24} color="#222" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});