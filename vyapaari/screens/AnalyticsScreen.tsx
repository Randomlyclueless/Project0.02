import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📈 Analytics</Text>
      <Text>Charts and earnings overview go here.</Text>
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
