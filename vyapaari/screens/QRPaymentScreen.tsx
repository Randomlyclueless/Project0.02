import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import Voice from "@react-native-community/voice";
import QRCode from "react-native-qrcode-svg";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
  off,
  get,
  child,
} from "firebase/database";
import { auth } from "../config/firebase"; // ✅ Only importing auth now

const QRPaymentScreen = () => {
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [qrData, setQrData] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [upiId, setUpiId] = useState("");

  const rtdb = getDatabase();

  useEffect(() => {
    const fetchUpiId = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const snapshot = await get(child(ref(rtdb), `vendors/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUpiId(data.upiId || "");
        } else {
          console.warn("Vendor profile not found in RTDB!");
        }
      } catch (error) {
        console.error("Error fetching UPI ID from RTDB:", error);
      }
    };

    fetchUpiId();

    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    }

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

    return () => off(txnRef);
  }, []);

  const handleVoiceInput = async () => {
    try {
      await Voice.start("en-US");
      Voice.onSpeechResults = (event) => {
        const value = event?.value;
        if (!value || value.length === 0) return;

        const speech = value[0];
        const parts = speech.split(" ");
        const vendorName = parts[0];
        const amt = parts.find((p) => !isNaN(parseFloat(p)));

        if (vendorName) setVendor(vendorName);
        if (amt) setAmount(amt);
      };
    } catch (error) {
      console.error("Voice error:", error);
    }
  };

  const handleSubmit = () => {
    if (!vendor || !amount || isNaN(parseFloat(amount))) {
      alert("Enter valid vendor name and amount");
      return;
    }

    const txnRef = push(ref(rtdb, "transactions"));
    const txnData = {
      vendor,
      amount: parseFloat(amount),
      method,
      timestamp: Date.now(),
      verified: method === "Cash",
    };

    set(txnRef, txnData);

    if (method === "QR") {
      if (!upiId) {
        alert("UPI ID not loaded yet!");
        return;
      }

      const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
        vendor
      )}&am=${amount}&cu=INR`;
      setQrData(upiUrl);

      // Auto-verify fallback after 2 mins
      setTimeout(() => {
        checkAndVerifyTransaction(txnRef.key, vendor, parseFloat(amount));
      }, 2 * 60 * 1000);
    } else {
      setQrData(null);
    }

    setVendor("");
    setAmount("");
  };

  const checkAndVerifyTransaction = (
    txnId: string | undefined,
    vendor: string,
    amount: number
  ) => {
    const txnRef = ref(rtdb, "transactions");

    onValue(
      txnRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const match = Object.entries(data).find(([id, txn]: any) => {
          return (
            txn.vendor === vendor &&
            txn.amount === amount &&
            txn.method === "QR" &&
            !txn.verified
          );
        });

        if (match) {
          const [id] = match;
          const updateRef = ref(rtdb, `transactions/${id}`);
          update(updateRef, { verified: true });
          Alert.alert("✅ Transaction verified!");
        }
      },
      { onlyOnce: true }
    );
  };

  const getTotal = () =>
    transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const getQR = () =>
    transactions
      .filter((t) => t.method === "QR")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  const getCash = () =>
    transactions
      .filter((t) => t.method === "Cash")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>QR Payment</Text>

      <TextInput
        style={styles.input}
        placeholder="Vendor Name"
        value={vendor}
        onChangeText={setVendor}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            method === "Cash" && styles.methodSelected,
          ]}
          onPress={() => setMethod("Cash")}
        >
          <Text style={styles.methodText}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.methodButton,
            method === "QR" && styles.methodSelected,
          ]}
          onPress={() => setMethod("QR")}
        >
          <Text style={styles.methodText}>QR</Text>
        </TouchableOpacity>
      </View>

      <Button title="Submit" onPress={handleSubmit} />
      <View style={{ height: 10 }} />
      <Button title="🎤 Voice Input" onPress={handleVoiceInput} />

      {qrData && (
        <View style={styles.qrContainer}>
          <Text style={styles.label}>Scan this QR to Pay</Text>
          <QRCode value={qrData} size={200} />
        </View>
      )}

      <Text style={styles.label}>📊 Summary</Text>
      <View>
        <Text>Total: ₹{getTotal()}</Text>
        <Text>QR: ₹{getQR()}</Text>
        <Text>Cash: ₹{getCash()}</Text>
      </View>

      <Text style={styles.history}>🧾 Transaction History</Text>
      {transactions.map((txn) => (
        <View key={txn.id} style={styles.txnItem}>
          <Text>Vendor: {txn.vendor}</Text>
          <Text>Amount: ₹{txn.amount}</Text>
          <Text>Method: {txn.method}</Text>
          <Text>Status: {txn.verified ? "✅ Verified" : "⏳ Pending"}</Text>
          <Text style={{ fontSize: 12, color: "#888" }}>
            {new Date(txn.timestamp).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  methodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  methodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginHorizontal: 5,
    alignItems: "center",
  },
  methodSelected: {
    backgroundColor: "#4CAF50",
  },
  methodText: {
    color: "#000",
    fontWeight: "600",
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  history: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "bold",
  },
  txnItem: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
});

export default QRPaymentScreen;
