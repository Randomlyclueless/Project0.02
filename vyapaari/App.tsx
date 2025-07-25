import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

// Localization
import "./config/i18n";
import { useTranslation } from "react-i18next";

// Screens
import AuthScreens from "./screens/AuthScreens";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import QRPaymentScreen from "./screens/QRPaymentScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import VyomScreen from "./screens/VyomScreen";
import ClientsScreen from "./screens/ClientsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoanReportScreen from "./screens/LoanReportScreen";
import InventoryScreen from "./screens/InventoryScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: t("dashboard") }}
      />
      <Drawer.Screen
        name="QR"
        component={QRPaymentScreen}
        options={{ title: "QR Code" }}
      />
      <Drawer.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: t("analytics") || "Analytics" }}
      />
      <Drawer.Screen
        name="Vyom"
        component={VyomScreen}
        options={{ title: t("vyom_assistant") || "Vyom Assistant" }}
      />
      <Drawer.Screen
        name="Clients"
        component={ClientsScreen}
        options={{ title: t("clients") || "Client Book" }}
      />
      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ title: "Inventory" }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t("settings") }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth" component={AuthScreens} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainApp" component={DrawerNavigator} />
          <Stack.Screen name="LoanReport" component={LoanReportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
