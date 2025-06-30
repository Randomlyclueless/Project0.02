import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { rtdb } from "../config/firebase"; // ✅ Realtime Database instance
import { onValue, ref } from "firebase/database";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const LoanReportScreen = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const txnRef = ref(rtdb, "transactions"); // ✅ Corrected from db ➝ rtdb
    const unsubscribe = onValue(txnRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const txnList = Object.values(data).filter((t: any) => {
          const txnDate = new Date(t.timestamp);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return txnDate >= thirtyDaysAgo;
        });
        setTransactions(txnList);
      } else {
        setTransactions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateStats = () => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const count = transactions.length;
    const avg = count ? (total / count).toFixed(2) : "0";
    const qrCount = transactions.filter((t) => t.method === "QR").length;
    const cashCount = transactions.filter((t) => t.method === "Cash").length;
    const repeatCount = new Set(transactions.map((t) => t.vendor)).size;

    return {
      total,
      count,
      avg,
      qrPercent: count ? ((qrCount / count) * 100).toFixed(1) : "0",
      cashPercent: count ? ((cashCount / count) * 100).toFixed(1) : "0",
      repeatCount,
    };
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const stats = calculateStats();

      const html = `
        <html>
          <body style="font-family: sans-serif; padding: 20px;">
            <h1>📄 Loan Application Report</h1>
            <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>
            <hr />
            <h2>Income Summary (Last 30 Days)</h2>
            <ul>
              <li><b>Total Revenue:</b> ₹${stats.total}</li>
              <li><b>Total Transactions:</b> ${stats.count}</li>
              <li><b>Average Daily Income:</b> ₹${stats.avg}</li>
              <li><b>QR Payments:</b> ${stats.qrPercent}%</li>
              <li><b>Cash Payments:</b> ${stats.cashPercent}%</li>
              <li><b>Unique Vendors (Repeat Buyers):</b> ${
                stats.repeatCount
              }</li>
            </ul>
            <hr />
            <p>📌 <b>Trust Score:</b> ${
              parseFloat(stats.qrPercent) > 60 ? "High" : "Moderate"
            }</p>
            <p>This document can be shared with financial institutions as proof of steady income through UPI payments.</p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Could not generate or share the report.");
      console.error("PDF error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📑 Instant Loan Report</Text>
      <Text style={styles.info}>
        This report includes the last 30 days of UPI and cash transaction data.
      </Text>
      <Button
        title={loading ? "Generating..." : "📤 Generate & Share Report"}
        onPress={generateReport}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default LoanReportScreen;
