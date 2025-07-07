import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import i18n from "../config/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translateText } from "../utils/translateUtils";

const keysToTranslate = [
  "dashboard",
  "greeting",
  "todays_income",
  "total_income",
  "pending_payments",
  "total_transactions",
  "earnings_overview",
  "recent_transactions",
  "paid",
  "pending",
];

const LanguageSelector = () => {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

  const handleChange = async (lang: string) => {
    setSelectedLang(lang);
    await AsyncStorage.setItem("appLanguage", lang);

    // Dynamically translate all keys
    const translations: Record<string, string> = {};
    for (const key of keysToTranslate) {
      translations[key] = await translateText(key.replace(/_/g, " "), lang);
    }

    i18n.addResourceBundle(lang, "translation", translations, true, true);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const loadLang = async () => {
      const lang = await AsyncStorage.getItem("appLanguage");
      if (lang) handleChange(lang);
    };
    loadLang();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("select_language", "Select Language")}:</Text>
      <Picker selectedValue={selectedLang} onValueChange={handleChange} style={styles.picker}>
        <Picker.Item label="English" value="en" />
        <Picker.Item label="हिन्दी" value="hi" />
        <Picker.Item label="தமிழ்" value="ta" />
        <Picker.Item label="বাংলা" value="bn" />
        <Picker.Item label="मराठी" value="mr" />
        <Picker.Item label="ગુજરાતી" value="gu" />
      </Picker>
    </View>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  picker: { height: 44, width: "100%" },
});
