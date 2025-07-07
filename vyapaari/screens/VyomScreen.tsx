// screens/VyomScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { translateText } from "../utils/translateUtils";
import axios from "axios";

const VyomScreen = () => {
  const { t, i18n } = useTranslation();
  const [translations, setTranslations] = useState<any>({});
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const tr = (key: string) => translations[key] || t(key) || key;

  useEffect(() => {
    const loadTranslations = async () => {
      const lang = i18n.language;
      if (lang === "en") return;
      const keys = ["ask_vyom", "type_query", "submit", "response"];
      const result: any = {};
      for (const k of keys) {
        result[k] = await translateText(k, lang);
      }
      setTranslations(result);
    };
    loadTranslations();
  }, [i18n.language]);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const result = await axios.post(
        "https://api.together.xyz/v1/chat/completions",
        {
          model: "mistralai/Mistral-7B-Instruct-v0.1",
          messages: [
            {
              role: "system",
              content:
                "You are Vyom, a friendly and knowledgeable assistant helping Indian small businesses.",
            },
            { role: "user", content: query },
          ],
          temperature: 0.7,
          max_tokens: 512,
        },
        {
          headers: {
            Authorization:
              "Bearer tgp_v1_g9q5qtZcPzcSNqVK9PJbg2ql1DRrjeIPCA6IefLzK4U",
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = result.data.choices?.[0]?.message?.content?.trim();
      if (aiResponse) setResponse(aiResponse);
      else setResponse("No response received.");
    } catch (err) {
      console.error("AI error:", err);
      setResponse("Sorry, Vyom failed to respond.");
    } finally {
      setLoading(false);
    }
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
        multiline
      />
      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.6 }]}
        onPress={handleAsk}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>{tr("submit")}</Text>
        )}
      </TouchableOpacity>
      {!!response && <Text style={styles.response}>{response}</Text>}
    </ScrollView>
  );
};

export default VyomScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
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
    minHeight: 80,
  },
  btn: {
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
  response: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
  },
});
