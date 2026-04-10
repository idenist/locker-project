import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Chip } from "react-native-paper";

const filters = ["현재 사용 가능한 보관함", "대형 가능"];

export default function FilterChips({ selectedFilters, onChangeFilters }) {
  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      onChangeFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      onChangeFilters([...selectedFilters, filter]);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.filterLabel}>필터:</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScrollContent}
      >
        {filters.map((filter) => {
          const selected = selectedFilters.includes(filter);

          return (
            <Chip
              key={filter}
              selected={selected}
              onPress={() => toggleFilter(filter)}
              style={[styles.chip, selected && styles.selectedChip]}
              textStyle={[styles.chipText, selected && styles.selectedChipText]}
              compact
            >
              {filter}
            </Chip>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 18,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginRight: 12,
  },
  chip: {
    marginRight: 10,
    backgroundColor: "#EDEFF3",
  },
  selectedChip: {
    backgroundColor: "#DDE7FF",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
    headerRow: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
});