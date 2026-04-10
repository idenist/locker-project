import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  contentContainer: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  sectionComment: {
    color: "#111",
    marginBottom: 10,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#F7F8FA",
  },
  mapButton: {
    borderRadius: 16,
  },
  mapButtonContent: {
    paddingVertical: 8,
  },
  mapButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  bottomSpace: {
    height: 30,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    marginBottom: 20,
  }
});