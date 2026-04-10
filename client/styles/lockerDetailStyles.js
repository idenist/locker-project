import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: "#111",
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  card: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
  },
  statusBox: {
    backgroundColor: "#F3EEFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#333",
    marginBottom: 4,
  },
  lineBox: {
    backgroundColor: "#F8F9FB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#355EDB",
  },
  additionalText: {
    fontSize: 12,
    lineHeight: 21,
    color: "#333",
    marginTop: 6
  },
  emphasis: {
    fontWeight: "800",
    color: "#355EDB",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    gap: 0
  },
  infoRowTop: {
    alignItems: "flex-start",
  },
  infoLabel: {
    width: 76,
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  infoValueContainer: {
    flex: 1,
    alignItems: "flex-end",
  },

  infoValue: {
    fontSize: 15,
    color: "#555",
    textAlign: "right",
  },
  multilineValue: {
    textAlign: "right",
  },
  divider: {
    backgroundColor: "#ECECEC",
  },
  backButton: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#355EDB",
  },
  backButtonContent: {
    paddingVertical: 6,
  },
  phoneInline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "nowrap",
  },
  phoneIcon: {
    margin: 0,
    marginLeft: 2,
  },
  infoBlock: {
  paddingVertical: 14,
  },
  blockLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 6,
    fontWeight: "500",
  },

  blockValue: {
    fontSize: 15,
    color: "#222",
    lineHeight: 26,
  },
  map: {
  width: "100%",
  height: 220,
  borderRadius: 14,
  marginTop: 12,
  overflow: "hidden"
  },
  
  mapButton: {
    marginTop: 10,
    backgroundColor: "#FEE500",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  mapButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#191919",
  },

  mapFallback: {
    marginTop: 12,
    height: 180,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  mapFallbackText: {
    fontSize: 14,
    color: "#666",
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
  mapButtonContent: {
    paddingVertical: 8,
  },
  mapButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  
});

export default styles;