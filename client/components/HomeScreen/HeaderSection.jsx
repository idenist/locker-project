import { StyleSheet, View } from "react-native";
import { Searchbar, Text } from "react-native-paper";

export default function HeaderSection({ searchQuery, onChangeSearch }) {
  return (
    <View style={styles.wrapper}>
      <Text variant="headlineSmall" style={styles.title}>
        가까운 공영 물품보관함을 찾아보세요
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        현재 위치 기준으로 이용 가능한 보관함 정보를 보여드려요
      </Text>

      <Searchbar
        placeholder="지역, 역명, 보관함 이름 검색"
        value={searchQuery}
        onChangeText={onChangeSearch}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    color: "#666",
    marginBottom: 6,
  },
  title: {
    fontWeight: "700",
    color: "#111",
    lineHeight: 34,
  },
  subtitle: {
    color: "#666",
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  searchbar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    elevation: 0,
  },
  searchInput: {
    minHeight: 0,
  },
});