import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

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
  const today = "2025-06-19";

  const totalToday = transactions
    .filter((t) => t.date === today && t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions.filter((t) => t.status === "pending");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>👋 Hi Vyapaari</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today’s Income</Text>
          <Text style={styles.cardValue}>₹{totalToday}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Income</Text>
          <Text style={styles.cardValue}>₹{totalIncome}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pending Payments</Text>
          <Text style={styles.cardValue}>{pendingPayments.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Transactions</Text>
          <Text style={styles.cardValue}>{transactions.length}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>📈 Earnings Overview</Text>
      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{ data: [100, 200, 150, 300, 250, 400, 350] }],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisSuffix="₹"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
          labelColor: () => "#333",
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#27ae60",
          },
        }}
        style={styles.chart}
      />

      <Text style={styles.sectionTitle}>🧾 Recent Transactions</Text>
      <FlatList
        data={transactions.slice(0, 5)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>
              • {item.customer} paid ₹{item.amount} ({item.status})
            </Text>
            <Text style={styles.transactionTime}>{item.time}</Text>
          </View>
        )}
      />
    </ScrollView>
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
