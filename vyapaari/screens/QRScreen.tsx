import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function QRScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📷 QR Code</Text>
      <Text>Generate and display your UPI QR code here.</Text>
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
