// screens/AuthScreens.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { auth, rtdb } from "../config/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import bcrypt from "bcryptjs";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

const AuthScreens = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [upiId, setUpiId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
              size: "invisible",
              callback: () => console.log("✅ reCAPTCHA verified"),
              "expired-callback": () => console.log("⚠️ reCAPTCHA expired"),
            }
          );
        }
      } catch (err) {
        console.warn("reCAPTCHA error:", err);
      }
    }
  }, []);

  const handleSendOtp = async () => {
    if (
      !name ||
      !phone ||
      !business ||
      !upiId ||
      !password ||
      !confirmPassword
    ) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    if (phone.length !== 10) {
      Toast.show({ type: "error", text1: "Enter a valid 10-digit number" });
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
      const fullPhone = `+91${phone}`;
      const appVerifier =
        Platform.OS === "web" ? window.recaptchaVerifier : undefined;
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        appVerifier
      );

      if (Platform.OS === "web") {
        window.confirmationResult = confirmation;
      }

      setOtpSent(true);
      Toast.show({ type: "success", text1: `OTP sent to ${fullPhone}` });
    } catch (err: any) {
      console.error("OTP send error:", err);
      Toast.show({ type: "error", text1: err.message || "Failed to send OTP" });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const confirmation =
        Platform.OS === "web" ? window.confirmationResult : undefined;

      if (!confirmation) {
        Toast.show({ type: "error", text1: "OTP confirmation not found." });
        return;
      }

      const result = await confirmation.confirm(otp);
      const user = result.user;

      const hashedPassword = bcrypt.hashSync(password, 10);

      await set(ref(rtdb, `users/${phone}`), {
        uid: user.uid,
        name,
        phone: `+91${phone}`,
        business,
        upiId,
        password: hashedPassword, // ✅ now it’s hashed
        createdAt: new Date().toISOString(),
      });

      Toast.show({ type: "success", text1: "🎉 Signed up successfully!" });
      navigation.replace("MainApp");
    } catch (err: any) {
      console.error("OTP verify error:", err);
      Toast.show({ type: "error", text1: "Invalid OTP" });
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
        placeholder="Phone Number"
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
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

      {!otpSent ? (
        <Pressable style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP & Continue</Text>
        </Pressable>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          <Pressable style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify OTP & Sign Up</Text>
          </Pressable>
        </>
      )}

      {/* 🔁 Link to Login Screen */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login here</Text>
      </TouchableOpacity>

      <View id="recaptcha-container" />
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
