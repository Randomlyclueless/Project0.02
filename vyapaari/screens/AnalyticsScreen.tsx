import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LineChart, PieChart } from "react-native-chart-kit";
import { rtdb } from "../config/firebase";
import { ref, onValue } from "firebase/database";
import { useTranslation } from "react-i18next";
import { translateText } from "../utils/translateUtils";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { t, i18n } = useTranslation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [translations, setTranslations] = useState<any>({});

  const tr = (key: string) => translations[key] || t(key) || key;

  useEffect(() => {
    const txnRef = ref(rtdb, "transactions");
    const unsubscribe = onValue(txnRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const txnList = Object.values(data);
        setTransactions(txnList.reverse());
      } else {
        setTransactions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      const lang = i18n.language;
      if (lang === "en") return;


      const keys = [
        "Analytics Dashboard",
        "Back",
        "No transactions today",
        "Total Revenue",
        "Transactions",
        "QR Split",
        "Cash Split",
        "Avg. Daily Income",
        "Peak Hour",
        "Repeat Buyers",
        "Fraud Detection",
        "No fraud",
        "Income Over 7 Days",
        "QR vs Cash",
        "View Loan Report",
      ];

      const dynamicTranslations: any = {};
      for (const key of keys) {
        dynamicTranslations[key] = await translateText(key, lang);
      }
      setTranslations(dynamicTranslations);
    };

    loadTranslations();
  }, [i18n.language]);

  const today = new Date().toDateString();
  const todayTxns = transactions.filter(
    (t) => new Date(t.timestamp).toDateString() === today
  );

  const totalRevenue = todayTxns.reduce((sum, t) => sum + t.amount, 0);
  const qrRevenue = todayTxns
    .filter((t) => t.method === "QR")
    .reduce((sum, t) => sum + t.amount, 0);
  const cashRevenue = todayTxns
    .filter((t) => t.method === "Cash")
    .reduce((sum, t) => sum + t.amount, 0);

  const qrPercent = totalRevenue
    ? ((qrRevenue / totalRevenue) * 100).toFixed(1)
    : "0";
  const cashPercent = totalRevenue
    ? ((cashRevenue / totalRevenue) * 100).toFixed(1)
    : "0";

  const last7Days = [...Array(7)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    })
    .reverse();

  const dailySums = last7Days.map((day) =>
    transactions
      .filter((t) => new Date(t.timestamp).toDateString() === day)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const avgDailyIncome =
    dailySums.reduce((a, b) => a + b, 0) / dailySums.length;

  const hourMap: Record<number, number> = {};
  todayTxns.forEach((t) => {
    const hour = new Date(t.timestamp).getHours();
    hourMap[hour] = (hourMap[hour] || 0) + 1;
  });

  const peakHour =
    Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const repeatBuyers = new Set();
  const buyerMap: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.vendor) {
      buyerMap[t.vendor] = (buyerMap[t.vendor] || 0) + 1;
      if (buyerMap[t.vendor] > 1) repeatBuyers.add(t.vendor);
    }
  });

  const frauds = todayTxns.filter(
    (t) => t.method === "QR" && t.verified === false
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>⬅️ {tr("Back")}</Text>
      </TouchableOpacity>

      <Text style={styles.header}>📊 {tr("Analytics Dashboard")}</Text>

      {todayTxns.length === 0 && (
        <Text style={styles.noData}>{tr("No transactions today")}</Text>
      )}

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.title}>{tr("Total Revenue")}</Text>
          <Text style={styles.value}>₹{Number(totalRevenue).toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{tr("Transactions")}</Text>
          <Text style={styles.value}>{todayTxns.length}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.title}>{tr("QR Split")}</Text>
          <Text style={styles.value}>QR: {qrPercent}%</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{tr("Cash Split")}</Text>
          <Text style={styles.value}>Cash: {cashPercent}%</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.title}>{tr("Avg. Daily Income")}</Text>
          <Text style={styles.value}>₹{avgDailyIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{tr("Peak Hour")}</Text>
          <Text style={styles.value}>{peakHour}:00</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{tr("Repeat Buyers")}</Text>
        <Text style={styles.value}>{repeatBuyers.size}</Text>
      </View>

      <View style={styles.fraudBox}>
        <Text style={styles.fraudHeader}>🚨 {tr("Fraud Detection")}</Text>
        {frauds.length > 0 ? (
          frauds.map((f, i) => (
            <View key={i} style={styles.fraudItem}>
              <Text style={{ textTransform: "capitalize" }}>
                • {f.vendor} - ₹{f.amount}
              </Text>
              <Text style={styles.fraudTime}>
                {new Date(f.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noFraud}>✅ {tr("No fraud")}</Text>
        )}
      </View>

      <Text style={styles.chartTitle}>📈 {tr("Income Over 7 Days")}</Text>
      <View style={{ width: screenWidth - 30, alignSelf: "center" }}>
        <LineChart
          data={{
            labels: last7Days.map((d) =>
              new Date(d).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })
            ),
            datasets: [{ data: dailySums }],
          }}
          width={screenWidth - 30}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fefefe",
            backgroundGradientTo: "#fefefe",
            color: () => "#4a90e2",
            labelColor: () => "#333",
          }}
          style={styles.chart}
        />
      </View>

      <Text style={styles.chartTitle}>💰 {tr("QR vs Cash")}</Text>
      <View style={{ width: screenWidth - 30, alignSelf: "center" }}>
        <PieChart
          data={[
            {
              name: "QR",
              population: parseFloat(qrPercent),
              color: "#4a90e2",
              legendFontColor: "#444",
              legendFontSize: 14,
            },
            {
              name: "Cash",
              population: parseFloat(cashPercent),
              color: "#4caf50",
              legendFontColor: "#444",
              legendFontSize: 14,
            },
          ]}
          width={screenWidth - 30}
          height={200}
          chartConfig={{ color: () => "#000" }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("LoanReport")}
      >
        <Text style={styles.btnText}>📤 {tr("View Loan Report")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#fff" },
  back: {
    color: "blue",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  noData: {
    fontStyle: "italic",
    color: "#999",
    marginBottom: 15,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    padding: 14,
    flex: 0.48,
  },
  title: { color: "#555", fontSize: 14 },
  value: { fontSize: 20, fontWeight: "bold", marginTop: 4 },
  chartTitle: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: "bold",
    color: "#333",
  },
  chart: { marginVertical: 8, borderRadius: 10 },
  btn: {
    backgroundColor: "#4a90e2",
    padding: 14,
    marginTop: 25,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  fraudBox: {
    marginTop: 20,
    backgroundColor: "#ffe5e5",
    padding: 15,
    borderRadius: 10,
  },
  fraudHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b71c1c",
    marginBottom: 10,
  },
  fraudItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#fdd",
    paddingVertical: 5,
  },
  fraudTime: {
    fontSize: 12,
    color: "#b71c1c",
  },
  noFraud: {
    fontSize: 14,
    color: "#333",
  },
});
