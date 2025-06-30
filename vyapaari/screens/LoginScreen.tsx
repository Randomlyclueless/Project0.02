// screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { rtdb } from "../config/firebase";
import { ref, get } from "firebase/database";
import Toast from "react-native-toast-message";
import bcrypt from "bcryptjs";

const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!phone || !password) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    try {
      const phoneRef = ref(rtdb, `users/${phone}`);
      const snapshot = await get(phoneRef);

      if (!snapshot.exists()) {
        Toast.show({ type: "error", text1: "User not found" });
        return;
      }

      const userData = snapshot.val();

      const isPasswordCorrect = bcrypt.compareSync(password, userData.password);

      if (!isPasswordCorrect) {
        Toast.show({ type: "error", text1: "Incorrect password" });
        return;
      }

      Toast.show({ type: "success", text1: "Login successful!" });
      navigation.replace("MainApp");
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({ type: "error", text1: "Login failed. Try again." });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login to Vyapaari</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
