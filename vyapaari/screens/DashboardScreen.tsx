import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from "victory";
import { ref, onValue, off } from "firebase/database";
import { rtdb } from "../config/firebase";
import FloatingVyomButton from "../components/FloatingVyomButton";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { translateText } from "../utils/translateUtils";

const DashboardScreen = () => {
  const { t, i18n } = useTranslation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const txnRef = ref(rtdb, "transactions");
    const unsubscribe = onValue(txnRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const txnList = Object.entries(data).map(([id, txn]: any) => ({
          id,
          customer: txn.vendor,
          amount: txn.amount,
          date: txn.timestamp.split("T")[0],
          time: new Date(txn.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status:
            txn.method === "QR" ? (txn.verified ? "paid" : "pending") : "paid",
        }));
        setTransactions(txnList.reverse());
      } else {
        setTransactions([]);
      }
    });

    return () => off(txnRef);
  }, []);

  useEffect(() => {
    const fetchDynamicTranslations = async () => {
      const lang = i18n.language;
      if (lang === "en") return;
 // already covered in resource bundles

      const keysToTranslate = [
        "Welcome back!",
        "Today's Income",
        "Total Income",
        "Pending Payments",
        "Total Transactions",
        "Earnings Overview",
        "Recent Transactions",
        "paid",
        "pending",
      ];

      const result: Record<string, string> = {};
      for (const key of keysToTranslate) {
        result[key] = await translateText(key, lang);
      }
      setTranslations(result);
    };

    fetchDynamicTranslations();
  }, [i18n.language]);

  const tr = (key: string) => translations[key] || t(key) || key;

  const totalToday = transactions
    .filter((t) => t.date === today && t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions.filter((t) => t.status === "pending");

  const chartData = [
    { x: "Mon", y: 100 },
    { x: "Tue", y: 200 },
    { x: "Wed", y: 150 },
    { x: "Thu", y: 300 },
    { x: "Fri", y: 250 },
    { x: "Sat", y: 400 },
    { x: "Sun", y: 350 },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <LanguageSelector />
        <Text style={styles.header}>👋 {tr("Welcome back!")}</Text>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{tr("Today's Income")}</Text>
            <Text style={styles.cardValue}>₹{totalToday}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{tr("Total Income")}</Text>
            <Text style={styles.cardValue}>₹{totalIncome}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{tr("Pending Payments")}</Text>
            <Text style={styles.cardValue}>{pendingPayments.length}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{tr("Total Transactions")}</Text>
            <Text style={styles.cardValue}>{transactions.length}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>📈 {tr("Earnings Overview")}</Text>
        <VictoryChart
          width={Dimensions.get("window").width - 40}
          height={220}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryAxis
            style={{
              axis: { stroke: "#333" },
              tickLabels: { fill: "#333", fontSize: 12 },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: "#333" },
              tickLabels: { fill: "#333", fontSize: 12 },
              ticks: { stroke: "#333" },
            }}
            tickFormat={(t) => `₹${t}`}
          />
          <VictoryLine
            data={chartData}
            style={{ data: { stroke: "#27ae60", strokeWidth: 2 } }}
            interpolation="monotoneX"
            animate={{ duration: 1000, onLoad: { duration: 500 } }}
          />
        </VictoryChart>

        <Text style={styles.sectionTitle}>🧾 {tr("Recent Transactions")}</Text>
        <View>
          {transactions.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <Text style={styles.transactionText}>
                • {item.customer} {tr("paid")} ₹{item.amount} ({tr(item.status)})
              </Text>
              <Text style={styles.transactionTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <FloatingVyomButton />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: "48%",
  },
  cardTitle: {
    fontSize: 14,
    color: "#333",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  transactionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  transactionText: {
    fontSize: 16,
  },
  transactionTime: {
    fontSize: 12,
    color: "#888",
  },
});
