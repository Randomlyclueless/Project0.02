import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from "victory"; // Import from 'victory'
import FloatingVyomButton from "../components/FloatingVyomButton";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "react-i18next";

const transactions = [
  {
    id: "1",
    customer: "Amit",
    amount: 200,
    date: "2025-06-19",
    time: "10:30 AM",
    status: "paid",
  },
  {
    id: "2",
    customer: "Neha",
    amount: 150,
    date: "2025-06-19",
    time: "11:45 AM",
    status: "pending",
  },
  {
    id: "3",
    customer: "Ravi",
    amount: 100,
    date: "2025-06-18",
    time: "03:20 PM",
    status: "paid",
  },
];

const DashboardScreen = () => {
  const { t } = useTranslation();
  const today = "2025-06-19";

  const totalToday = transactions
    .filter((t) => t.date === today && t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions.filter((t) => t.status === "pending");

  // Data for the VictoryLine chart
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

        <Text style={styles.header}>👋 {t("greeting")}</Text>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("todays_income")}</Text>
            <Text style={styles.cardValue}>₹{totalToday}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("total_income")}</Text>
            <Text style={styles.cardValue}>₹{totalIncome}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("pending_payments")}</Text>
            <Text style={styles.cardValue}>{pendingPayments.length}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("total_transactions")}</Text>
            <Text style={styles.cardValue}>{transactions.length}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>📈 {t("earnings_overview")}</Text>
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
            style={{
              data: {
                stroke: "#27ae60",
                strokeWidth: 2,
              },
            }}
            interpolation="monotoneX"
            animate={{
              duration: 1000,
              onLoad: { duration: 500 },
            }}
          />
        </VictoryChart>

        <Text style={styles.sectionTitle}>🧾 {t("recent_transactions")}</Text>

        <View>
          {transactions.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <Text style={styles.transactionText}>
                • {item.customer} {t("paid")} ₹{item.amount} ({t(item.status)})
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
  chart: {
    borderRadius: 10,
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
