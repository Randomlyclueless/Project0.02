import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // 🤖 icon
import { DrawerParamList } from "../App"; // ✅ Update the path if needed

type VyomButtonNav = DrawerNavigationProp<DrawerParamList, "Vyom Assistant">;

const FloatingVyomButton = () => {
  const navigation = useNavigation<VyomButtonNav>();

  const handlePress = () => {
    navigation.navigate("Vyom Assistant");
  };

  return (
    <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="robot" size={28} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
  iconContainer: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default FloatingVyomButton;
