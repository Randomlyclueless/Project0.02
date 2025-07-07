// screens/AuthScreens.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { auth, rtdb } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { translateText } from "../utils/translateUtils";

const AuthScreens = ({ navigation }: any) => {
  const { t, i18n } = useTranslation();
  const [translations, setTranslations] = useState<any>({});
  const tr = (key: string) => translations[key] || t(key) || key;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [upiId, setUpiId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const loadTranslations = async () => {
      const lang = i18n.language;
      if (lang === "en") return;
      const keys = [
        "Create your Vyapaari account",
        "Full Name",
        "Email Address",
        "Business Name",
        "UPI ID",
        "Password",
        "Confirm Password",
        "Sign Up",
        "Already have an account? Login here",
      ];
      const result: any = {};
      for (const key of keys) {
        result[key] = await translateText(key, lang);
      }
      setTranslations(result);
    };
    loadTranslations();
  }, [i18n.language]);

  const handleSignup = async () => {
    if (!name || !email || !business || !upiId || !password || !confirmPassword) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    if (!email.includes("@")) {
      Toast.show({ type: "error", text1: "Enter a valid email" });
      return;
    }

    if (!upiId.includes("@")) {
      Toast.show({
        type: "error",
        text1: "Enter a valid UPI ID (e.g. name@bank)",
      });
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userData = {
        uid,
        name,
        email,
        business,
        upiId,
        createdAt: new Date().toISOString(),
      };

      await set(ref(rtdb, `users/${uid}`), userData);

      Toast.show({ type: "success", text1: "🎉 Signed up successfully!" });
      navigation.replace("MainApp");
    } catch (err: any) {
      console.error("Signup error:", err);
      let message = "Signup failed";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already in use.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (err.code === "auth/weak-password") {
        message = "Weak password. Try a stronger one.";
      }
      Toast.show({ type: "error", text1: message });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LanguageSelector />

      <Text style={styles.title}>📋 {tr("Create your Vyapaari account")}</Text>

      <TextInput
        style={styles.input}
        placeholder={tr("Full Name")}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder={tr("Email Address")}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={tr("Business Name")}
        value={business}
        onChangeText={setBusiness}
      />
      <TextInput
        style={styles.input}
        placeholder={tr("UPI ID")}
        value={upiId}
        onChangeText={setUpiId}
      />
      <TextInput
        style={styles.input}
        placeholder={tr("Password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder={tr("Confirm Password")}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>{tr("Sign Up")}</Text>
      </Pressable>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>{tr("Already have an account? Login here")}</Text>
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
