import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

export default function LocationCard() {
  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Content>
        <Text variant="labelMedium" style={styles.label}>
          현재 위치
        </Text>
        <Text variant="titleLarge" style={styles.location}>
          서울역 근처
        </Text>
        <Text variant="bodySmall" style={styles.updated}>
          마지막 갱신: 2분 전
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  label: {
    color: "#888",
    marginBottom: 4,
  },
  location: {
    fontWeight: "700",
    color: "#111",
  },
  updated: {
    marginTop: 8,
    color: "#777",
  },
});