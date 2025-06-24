import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ClientsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>👥 Client Book</Text>
      <Text>View your clients and their payment history here.</Text>
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
