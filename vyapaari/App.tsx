import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

// Screens
import DashboardScreen from "./screens/DashboardScreen";
import QRPaymentScreen from "./screens/QRPaymentScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import VyomScreen from "./screens/VyomScreen";
import ClientsScreen from "./screens/ClientsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoanReportScreen from "./screens/LoanReportScreen";

enableScreens();

// ✅ Define the types for stack and drawer
export type RootStackParamList = {
  RootDrawer: undefined;
  LoanReport: undefined;
  "Vyom Assistant": undefined; // ✅ Added this to stack params
};

export type DrawerParamList = {
  "Hii Vyapaari": undefined;
  Transactions: undefined;
  "QR Code": undefined;
  Analytics: undefined;
  "Vyom Assistant": undefined;
  "Client Book": undefined;
  Settings: undefined;
};

// ✅ Navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Hii Vyapaari"
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Hii Vyapaari" component={DashboardScreen} />
      <Drawer.Screen name="QR Code" component={QRPaymentScreen} />
      <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
      <Drawer.Screen name="Vyom Assistant" component={VyomScreen} />
      <Drawer.Screen name="Client Book" component={ClientsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

// ✅ Main App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RootDrawer" component={DrawerNavigator} />
        <Stack.Screen name="LoanReport" component={LoanReportScreen} />
        <Stack.Screen name="Vyom Assistant" component={VyomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
