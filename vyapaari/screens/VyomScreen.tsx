// screens/VyomScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { translateText } from "../utils/translateUtils";

const VyomScreen = () => {
  const { t, i18n } = useTranslation();
  const [translations, setTranslations] = useState<any>({});
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const tr = (key: string) => translations[key] || t(key) || key;

  useEffect(() => {
    const loadTranslations = async () => {
      const lang = i18n.language;
      if (lang === "en") return;

      const keys = [
        "ask_vyom",
        "type_query",
        "submit",
        "response",
      ];
      const result: any = {};
      for (const k of keys) {
        result[k] = await translateText(k, lang);
      }
      setTranslations(result);
    };
    loadTranslations();
  }, [i18n.language]);

  const handleAsk = async () => {
    if (!query) return;
    // Simulated response
    setResponse(`${tr("response")}: ${query} (simulated)`);
  };

  return (
    <ScrollView style={styles.container}>
      <LanguageSelector />
      <Text style={styles.header}>🤖 {tr("ask_vyom")}</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder={tr("type_query")}
      />
      <TouchableOpacity style={styles.btn} onPress={handleAsk}>
        <Text style={styles.btnText}>{tr("submit")}</Text>
      </TouchableOpacity>
      {response ? <Text style={styles.response}>{response}</Text> : null}
    </ScrollView>
  );
};

export default VyomScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
});
