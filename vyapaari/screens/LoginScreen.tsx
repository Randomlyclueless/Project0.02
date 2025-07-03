import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-toast-message";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Toast.show({ type: "success", text1: "Login successful!" });
      navigation.replace("MainApp");
    } catch (error: any) {
      console.error("Login error:", error);
      let msg = "Login failed.";
      if (error.code === "auth/user-not-found") {
        msg = "User not found";
      } else if (error.code === "auth/wrong-password") {
        msg = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        msg = "Invalid email";
      }
      Toast.show({ type: "error", text1: msg });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login to Vyapaari</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
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
