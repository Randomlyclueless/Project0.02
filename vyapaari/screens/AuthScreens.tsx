// screens/AuthScreens.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { auth, rtdb } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

const AuthScreens = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [upiId, setUpiId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (
      !name ||
      !email ||
      !business ||
      !upiId ||
      !password ||
      !confirmPassword
    ) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    if (!email.includes("@")) {
      Toast.show({ type: "error", text1: "Enter a valid email" });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 6 characters",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      await set(ref(rtdb, `users/${uid}`), {
        uid,
        name,
        email,
        business,
        upiId,
        createdAt: new Date().toISOString(),
      });

      Toast.show({ type: "success", text1: "🎉 Signed up successfully!" });
      navigation.replace("MainApp");
    } catch (err: any) {
      console.error("Signup error:", err);
      Toast.show({ type: "error", text1: err.message || "Signup failed" });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Create your Vyapaari account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
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
        placeholder="Business Name"
        value={business}
        onChangeText={setBusiness}
      />
      <TextInput
        style={styles.input}
        placeholder="UPI ID"
        value={upiId}
        onChangeText={setUpiId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AuthScreens;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#1E90FF",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});
