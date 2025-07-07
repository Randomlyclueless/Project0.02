import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { translateText } from "../utils/translateUtils";
import LanguageSelector from "../components/LanguageSelector";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [translations, setTranslations] = useState<any>({});

  const tr = (key: string) => translations[key] || t(key) || key;

  useEffect(() => {
    const loadTranslations = async () => {
      const lang = i18n.language;
      if (lang === "en") return;

      const keys = [
        "Settings",
        "Vendor info, UPI settings, and app preferences.",
      ];
      const result: Record<string, string> = {};
      for (const key of keys) {
        try {
          result[key] = await translateText(key, lang);
        } catch {
          result[key] = key;
        }
      }
      setTranslations(result);
    };

    loadTranslations();
  }, [i18n.language]);

  return (
    <View style={styles.container}>
      <LanguageSelector />
      <Text style={styles.header}>⚙️ {tr("Settings")}</Text>
      <Text>{tr("Vendor info, UPI settings, and app preferences.")}</Text>
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
