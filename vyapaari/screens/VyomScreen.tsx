import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const COHERE_API_KEY = "AlNM4wVe7r6YZIJnJf3XA3Q39HGYpm4A2ITF42FZ";

const VyomScreen = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<
    { type: "user" | "vyom"; message: string }[]
  >([{ type: "vyom", message: "Hi, I'm Vyom. How can I help you today?" }]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (msg: string) => {
    if (!msg.trim()) return;

    const userMessage = msg.trim();
    setChat((prev) => [...prev, { type: "user", message: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${COHERE_API_KEY}`, // 🔑 Authorization here
        },
        body: JSON.stringify({
          model: "command-r-plus", // or "command-r"
          message: userMessage,
        }),
      });

      const data = await res.json();
      const reply = data.text || "Vyom didn't understand that.";

      setChat((prev) => [...prev, { type: "vyom", message: reply }]);
    } catch (err) {
      console.error("Cohere Error:", err);
      setChat((prev) => [
        ...prev,
        {
          type: "vyom",
          message: "Oops! Something went wrong. Try again later.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        style={styles.chat}
        data={chat}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.type === "user" ? styles.userBubble : styles.vyomBubble,
            ]}
          >
            <Text>{item.message}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask Vyom..."
          onSubmitEditing={() => handleSend(input)}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => handleSend(input)}
        >
          <Text style={styles.sendText}>{loading ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VyomScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  chat: { flex: 1 },
  bubble: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  vyomBubble: {
    backgroundColor: "#E8E8E8",
    alignSelf: "flex-start",
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 10,
    marginLeft: 8,
  },
  sendText: { color: "#fff", fontWeight: "600" },
});
