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
} from "react-native";
import Toast from "react-native-toast-message";
import { auth } from "../config/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

// Suppress unwanted console warnings:
const originalWarn = console.warn;
console.warn = (message?: string, ...args: any[]) => {
  if (
    typeof message === "string" &&
    (message.includes("Unknown event handler property") ||
      message.includes("TouchableMixin is deprecated") ||
      message.includes("This method is deprecated"))
  )
    return;
  originalWarn(message, ...args);
};

// Extend window for recaptcha
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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified"),
          "expired-callback": () => console.log("reCAPTCHA expired"),
        }
      );
    }
  }, []);

  const handleSendOtp = async () => {
    if (!name || !phone || !business || !upiId) {
      Toast.show({ type: "error", text1: "Fill all fields" });
      return;
    }
    if (phone.length !== 10) {
      Toast.show({ type: "error", text1: "Enter valid 10-digit phone number" });
      return;
    }

    try {
      const fullPhone = `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        appVerifier
      );
      window.confirmationResult = confirmation;
      Toast.show({ type: "success", text1: `OTP sent to ${fullPhone}` });
      setOtpSent(true);
    } catch (err: any) {
      console.error("SMS send error:", err);
      Toast.show({ type: "error", text1: err.message || "Failed to send OTP" });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await window.confirmationResult.confirm(otp);
      Toast.show({ type: "success", text1: "Phone Verified!" });
      navigation.replace("MainApp");
    } catch (err: any) {
      console.error("OTP verify error:", err);
      Toast.show({ type: "error", text1: "Invalid OTP" });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👋 Welcome Vyapaari</Text>

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

      {!otpSent ? (
        <Pressable style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Continue & Send OTP</Text>
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
            <Text style={styles.buttonText}>Verify & Continue</Text>
          </Pressable>
        </>
      )}

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
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
