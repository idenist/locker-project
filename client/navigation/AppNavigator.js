import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LockerDetailScreen from "../screens/LockerDetailScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "보관함 현황",
          headerStyle: {
            backgroundColor: "#0B7CC1",
            elevation: 0, // 안드로이드 그림자 제거
            shadowOpacity: 0, // iOS 그림자 제거
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: "800",
          },
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="LockerDetail"
        component={LockerDetailScreen}
        options={{
          title: "보관함 상세정보",
          headerStyle: {
            backgroundColor: "#0B7CC1",
            elevation: 0, // 안드로이드 그림자 제거
            shadowOpacity: 0, // iOS 그림자 제거
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: "800",
          },
          headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          title: "물품보관함 맵",
          headerStyle: {
            backgroundColor: "#0B7CC1",
            elevation: 0, // 안드로이드 그림자 제거
            shadowOpacity: 0, // iOS 그림자 제거
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: "800",
          },
          headerTitleAlign: "left",
        }}
      />
    </Stack.Navigator>
  );
}