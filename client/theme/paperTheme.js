import { MD3LightTheme } from "react-native-paper";

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#4F7CFF",
    secondary: "#EEF3FF",
    background: "#F7F8FA",
    surface: "#FFFFFF",
    surfaceVariant: "#F1F3F6",
    onSurface: "#111111",
    onSurfaceVariant: "#666666",
    outline: "#E3E7EE",
    error: "#E04848",
  },
  roundness: 16,
};

export default paperTheme;