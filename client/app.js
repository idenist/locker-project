import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./navigation/AppNavigator";
import paperTheme from "./theme/paperTheme";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer theme={paperTheme}>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}