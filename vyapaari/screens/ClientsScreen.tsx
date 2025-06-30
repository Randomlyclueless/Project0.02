import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { onValue, remove, update } from "firebase/database";
import { rtdb } from "../config/firebase";
import { Client } from "../config/clientTypes";
import LanguageSelector from "../components/LanguageSelector";
import { getDatabase, ref, push, set } from "firebase/database";
const ClientScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "totalSpent">("name");
  const [modalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", contact: "" });
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    const clientsRef = ref(rtdb, "clients");
    const unsubscribe = onValue(clientsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedClients: Client[] = Object.entries(data).map(
        ([id, client]: any) => ({
          id,
          ...client,
        })
      );
      setClients(loadedClients);
    });

    return () => unsubscribe();
  }, []);

  const filteredClients = useMemo(() => {
    let result = clients.filter((client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return result.sort((a, b) =>
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : b.totalSpent - a.totalSpent
    );
  }, [clients, searchQuery, sortBy]);

  const handleSaveClient = () => {
    if (!newClient.name || !newClient.contact) return;

    if (editingClient) {
      const clientRef = ref(rtdb, `clients/${editingClient.id}`);
      update(clientRef, {
        name: newClient.name,
        contact: newClient.contact,
      });
    } else {
      const newRef = push(ref(rtdb, "clients"));
      set(newRef, {
        name: newClient.name,
        contact: newClient.contact,
        totalSpent: 0,
        lastTransaction: "-",
        history: [],
      });
    }

    setNewClient({ name: "", contact: "" });
    setEditingClient(null);
    setModalVisible(false);
  };

  const handleDeleteClient = (id: string) => {
    Alert.alert(t("confirm"), t("delete_client_question"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          const clientRef = ref(rtdb, `clients/${id}`);
          remove(clientRef);
        },
      },
    ]);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setNewClient({ name: client.name, contact: client.contact });
    setModalVisible(true);
  };

  const handleClientPress = (client: Client) => {
    Alert.alert(
      `${client.name}'s History`,
      client.history?.length
        ? client.history
            .map((h) => `${h.date}: ₹${h.amount} - ${h.description}`)
            .join("\n")
        : "No history available."
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LanguageSelector />
        <Text style={styles.header}>👥 {t("clients")}</Text>

        <TextInput
          style={styles.searchInput}
          placeholder={t("search_clients")}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>{t("sort_by")}</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "name" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("name")}
          >
            <Text style={styles.sortButtonText}>{t("name")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "totalSpent" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("totalSpent")}
          >
            <Text style={styles.sortButtonText}>{t("total_spent")}</Text>
          </TouchableOpacity>
        </View>

        {filteredClients.map((item) => (
          <View style={styles.clientBox} key={item.id}>
            <TouchableOpacity
              onPress={() => handleClientPress(item)}
              style={{ flex: 1 }}
            >
              <Text style={styles.clientName}>{item.name}</Text>
              <Text style={styles.clientDetail}>
                {t("total_spent")}: ₹{item.totalSpent}
              </Text>
              <Text style={styles.clientDetail}>
                {t("last_transaction")}: {item.lastTransaction}
              </Text>
              <Text style={styles.clientDetail}>
                {t("contact")}: {item.contact}
              </Text>
            </TouchableOpacity>
            <View style={styles.clientActions}>
              <TouchableOpacity onPress={() => handleEditClient(item)}>
                <Text style={styles.actionText}>{t("edit")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteClient(item.id)}>
                <Text style={[styles.actionText, { color: "red" }]}>
                  {t("delete")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ➕ Floating Button to Add New Client */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          setNewClient({ name: "", contact: "" });
          setEditingClient(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.floatingButtonText}>＋</Text>
      </TouchableOpacity>

      {/* ➕ Add / Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingClient ? t("edit_client") : t("add_client")}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t("client_name")}
              value={newClient.name}
              onChangeText={(text) =>
                setNewClient({ ...newClient, name: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder={t("contact")}
              value={newClient.contact}
              onChangeText={(text) =>
                setNewClient({ ...newClient, contact: text })
              }
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveClient}
              >
                <Text style={styles.modalButtonText}>{t("save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ClientScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sortLabel: { fontSize: 16, marginRight: 10 },
  sortButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },
  sortButtonActive: { backgroundColor: "#27ae60" },
  sortButtonText: { fontSize: 14, color: "#333" },
  clientBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientName: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  clientDetail: { fontSize: 14, color: "#555" },
  clientActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionText: { fontSize: 14, color: "#007bff" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: Dimensions.get("window").width - 40,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 15 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f2f2f2",
    width: "48%",
    alignItems: "center",
  },
  modalButtonSave: { backgroundColor: "#27ae60" },
  modalButtonText: { fontSize: 16, color: "#333" },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#27ae60",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});
