import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

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
// 🚫 ToDoScreen import is removed

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

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
      {/* 🚫 ToDo List screen removed */}
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
