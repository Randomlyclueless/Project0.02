// screens/QRPaymentScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import { rtdb, auth } from "../config/firebase";
import {
  ref,
  push,
  onValue,
  update,
  off,
  get,
  set,
} from "firebase/database";
import QRCode from "react-native-qrcode-svg";
import Toast from "react-native-toast-message";

const QRPaymentScreen = () => {
  const [qrData, setQrData] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userUpi, setUserUpi] = useState("");
  const [savedUpi, setSavedUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [cashVendor, setCashVendor] = useState("");

  useEffect(() => {
    const txnRef = ref(rtdb, "transactions");
    const unsubscribe = onValue(txnRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const txnList = Object.entries(data).map(([id, txn]: any) => ({
          id,
          ...txn,
        }));
        setTransactions(txnList.reverse());
      } else {
        setTransactions([]);
      }
    });

    const fetchUserUpi = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snapshot = await get(ref(rtdb, `users/${user.uid}/upiId`));
      if (snapshot.exists()) {
        const upi = snapshot.val();
        setUserUpi(upi);
        setSavedUpi(upi);
      }
    };

    fetchUserUpi();

    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    }

    return () => off(txnRef);
  }, []);

  const generateQR = async () => {
    const user = auth.currentUser;
    if (!user || !savedUpi) return;

    const txnRef = ref(rtdb, "transactions");
    const txnId = push(txnRef).key;
    const blankTxn = {
      uid: user.uid,
      method: "QR",
      timestamp: new Date().toISOString(),
      verified: false,
    };

    await set(ref(rtdb, `transactions/${txnId}`), blankTxn);
    const upiUrl = `upi://pay?pa=${savedUpi}&pn=Vyapaari&am=&cu=INR`;
    setQrData(upiUrl);

    // Listen for verified match
    const listener = onValue(txnRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const match = Object.entries(data).find(([_key, val]: any) => {
        return (
          val.uid === user.uid &&
          val.verified === true &&
          val.method === "QR" &&
          val.vendor &&
          val.amount
        );
      });

      if (match && txnId) {
        const [_key, matchedTxn]: any = match;
        update(ref(rtdb, `transactions/${txnId}`), {
          vendor: matchedTxn.vendor,
          amount: matchedTxn.amount,
          verified: true,
        });
        setQrData(null);
        Toast.show({ type: "success", text1: "Payment verified" });
        off(txnRef);
      }
    });

    setTimeout(() => {
      setQrData(null);
    }, 15000);
  };

  const handleCashPayment = async () => {
    const user = auth.currentUser;
    if (!user || !cashVendor || !amount) return;

    const txn = {
      uid: user.uid,
      vendor: cashVendor,
      amount: parseFloat(amount),
      method: "Cash",
      timestamp: new Date().toISOString(),
      verified: true,
    };

    const txnRef = ref(rtdb, "transactions");
    await push(txnRef, txn);
    setCashVendor("");
    setAmount("");
    Toast.show({ type: "success", text1: "Cash payment added" });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.section}>📌 Your UPI QR</Text>
      <TouchableOpacity style={styles.qrBtn} onPress={generateQR}>
        <Text style={styles.btnText}>Generate QR</Text>
      </TouchableOpacity>
      {qrData && (
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <QRCode value={qrData} size={200} />
        </View>
      )}

      <Text style={styles.section}>💵 Cash Payment</Text>
      <TextInput
        style={styles.input}
        value={cashVendor}
        onChangeText={setCashVendor}
        placeholder="Customer Name"
      />
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Amount"
      />
      <TouchableOpacity style={styles.cashBtn} onPress={handleCashPayment}>
        <Text style={styles.btnText}>Add Cash Payment</Text>
      </TouchableOpacity>

      <Text style={styles.section}>🧾 Live Transactions</Text>
      {transactions.map((t, i) => (
        <View key={i} style={styles.txn}>
          <Text>
            {t.vendor || "User"} - ₹{t.amount || "--"} via {t.method} {" "}
            {t.method === "QR" && (t.verified ? "✅" : "⚠ Unverified")}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(t.timestamp).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  section: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  qrBtn: {
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  cashBtn: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  txn: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  timestamp: { fontSize: 12, color: "#888" },
});

export default QRPaymentScreen;
