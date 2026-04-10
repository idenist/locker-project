import React from "react";
import { TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import styles from "../../styles/lockerDetailStyles";
import { handleCall, formatPhoneNumber } from "../../utils/formatters";

export default function PhoneValue({ phone }) {
  if (!phone) return <Text style={styles.infoValue}>-</Text>;

  return (
    <TouchableOpacity
      style={styles.phoneInline}
      onPress={() => handleCall(phone)}
      activeOpacity={0.7}
    >
      <IconButton
        icon="phone"
        size={18}
        onPress={() => handleCall(phone)}
        style={styles.phoneIcon}
      />
      <Text style={styles.infoValue}>{formatPhoneNumber(phone)}</Text>
    </TouchableOpacity>
  );
}