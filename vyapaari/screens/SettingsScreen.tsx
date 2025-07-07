import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { getDatabase, ref, get } from "firebase/database";
import { auth } from "../config/firebase";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [userData, setUserData] = useState<any>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const toggle = (setter: any, value: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(!value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const dbRef = ref(getDatabase(), `users/${uid}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚙️ {t("Settings")}</Text>

      {/* Profile Section */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggle(setProfileOpen, profileOpen)}
      >
        <Text style={styles.sectionTitle}>👤 My Profile</Text>
      </TouchableOpacity>
      {profileOpen && (
        <View style={styles.dropdown}>
          <Text>Name: {userData?.name || "—"}</Text>
          <Text>Email: {userData?.email || "—"}</Text>
          <Text>Business: {userData?.business || "—"}</Text>
          <Text>UPI ID: {userData?.upiId || "—"}</Text>
          {/* You can add an Edit button here */}
        </View>
      )}

      {/* Contact Section */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggle(setContactOpen, contactOpen)}
      >
        <Text style={styles.sectionTitle}>📞 Contact Us</Text>
      </TouchableOpacity>
      {contactOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:vyapaari@gmail.com")}
          >
            <Text style={styles.linkText}>
              📧 Write to us at vyapaari@gmail.com
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Preferences */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggle(setPrefsOpen, prefsOpen)}
      >
        <Text style={styles.sectionTitle}>🌐 Preferences</Text>
      </TouchableOpacity>
      {prefsOpen && (
        <View style={styles.dropdown}>
          <LanguageSelector />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionHeader: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  dropdown: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  linkText: {
    color: "#1e90ff",
    textDecorationLine: "underline",
    marginTop: 6,
  },
});
