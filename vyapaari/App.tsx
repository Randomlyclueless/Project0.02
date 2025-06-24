import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import Toast from "react-native-toast-message";

// Screens
import AuthScreen from "./screens/AuthScreens";
import DashboardScreen from "./screens/DashboardScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import QRScreen from "./screens/QRScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import VyomScreen from "./screens/VyomScreen";
import ClientsScreen from "./screens/ClientsScreen";
import SettingsScreen from "./screens/SettingsScreen";

// Enable performance optimization
enableScreens();

// Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      {...({ id: "RootDrawer" } as any)}
      initialRouteName="Hii Vyapaari"
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Hii Vyapaari" component={DashboardScreen} />
      <Drawer.Screen name="Transactions" component={TransactionsScreen} />
      <Drawer.Screen name="QR Code" component={QRScreen} />
      <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
      <Drawer.Screen name="Vyom Assistant" component={VyomScreen} />
      <Drawer.Screen name="Client Book" component={ClientsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

// Root App
export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          {...({ id: "RootStack" } as any)}
          initialRouteName="Auth"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="MainApp" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
