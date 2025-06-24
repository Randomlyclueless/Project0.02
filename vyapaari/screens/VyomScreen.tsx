import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VyomScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧠 Vyom Assistant</Text>
      <Text>Tap the floating button to chat with Vyom.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
