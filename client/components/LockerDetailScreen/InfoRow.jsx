import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import styles from "../../styles/lockerDetailStyles";

export default function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueContainer}>
        {typeof value === "string" || typeof value === "number" ? (
          <Text style={styles.infoValue}>{value || "-"}</Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
}