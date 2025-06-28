import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import i18n from "../config/i18n";

const LanguageSelector = () => {
  const { t } = useTranslation();

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {t("select_language") || "Select Language"}:
      </Text>
      <Picker
        selectedValue={i18n.language}
        onValueChange={handleChange}
        style={styles.picker}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="हिन्दी" value="hi" />
        <Picker.Item label="தமிழ்" value="ta" />
        <Picker.Item label="বাংলা" value="bn" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  picker: {
    height: 44,
    width: "100%",
  },
});

export default LanguageSelector;
