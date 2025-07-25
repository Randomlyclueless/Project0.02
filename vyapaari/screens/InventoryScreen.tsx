import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import { Card } from "@rneui/themed";
import { Feather, MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

const InventoryScreen = () => {
  const [inventoryData, setInventoryData] = useState([
    { id: 1, name: "Item A", quantity: 10, price: 100 },
    { id: 2, name: "Item B", quantity: 5, price: 250 },
    { id: 3, name: "Item C", quantity: 0, price: 300 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });

  const lowStockItems = inventoryData.filter(item => item.quantity <= 5);

  const totalInventoryValue = inventoryData.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleAddItem = () => {
    const id = inventoryData.length + 1;
    const itemToAdd = {
      id,
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      price: parseFloat(newItem.price),
    };
    setInventoryData([...inventoryData, itemToAdd]);
    setNewItem({ name: "", quantity: "", price: "" });
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📦 Inventory Dashboard</Text>

      <View style={styles.featureRow}>
        <Feature
          icon={<Feather name="plus-circle" size={30} color="#007AFF" />} 
          label="Add Item"
          onPress={() => setModalVisible(true)}
        />
        <Feature icon={<MaterialIcons name="update" size={30} color="#FF9500" />} label="Update Stock" />
        <Feature icon={<Ionicons name="md-remove-circle" size={30} color="#FF3B30" />} label="Remove Item" />
        <Feature icon={<FontAwesome5 name="filter" size={26} color="#8E8E93" />} label="Filter" />
      </View>

      <View style={styles.featureRow}>
        <Feature icon={<Feather name="download" size={30} color="#34C759" />} label="Export CSV" />
        <Feature icon={<Ionicons name="search-circle" size={30} color="#5856D6" />} label="Search" />
        <Feature icon={<MaterialIcons name="mic" size={30} color="#AF52DE" />} label="Voice Input" />
        <Feature icon={<Feather name="refresh-cw" size={30} color="#FF2D55" />} label="Auto Sync" />
      </View>

      <View style={styles.featureRow}>
        <Feature icon={<Feather name="alert-circle" size={30} color="#FF9500" />} label="Low Stock" />
        <Feature icon={<Ionicons name="md-notifications" size={30} color="#007AFF" />} label="Alerts" />
      </View>

      {/* Additional Features */}
      <Card containerStyle={styles.card}>
        <Text style={styles.featureTitle}>📊 Inventory Value Summary</Text>
        <Text style={styles.featureText}>Total Inventory Value: ₹{totalInventoryValue}</Text>
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.featureTitle}>⚠️ Low Stock Alerts</Text>
        {lowStockItems.length > 0 ? (
          lowStockItems.map(item => (
            <Text key={item.id} style={{ color: 'red' }}>{item.name} - Only {item.quantity} left</Text>
          ))
        ) : (
          <Text style={{ color: 'green' }}>All items well stocked</Text>
        )}
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.featureTitle}>📜 Recent Activity</Text>
        <Text style={styles.featureText}>+ Added Item C</Text>
        <Text style={styles.featureText}>- Sold Item B</Text>
        <Text style={styles.featureText}>+ Updated Price of Item A</Text>
      </Card>

      <Text style={styles.subHeader}>🧾 All Items</Text>
      {inventoryData.map(item => (
        <Card key={item.id} containerStyle={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </View>
          <Text style={item.quantity <= 5 ? styles.lowStock : styles.quantity}>
            Stock: {item.quantity}
          </Text>
        </Card>
      ))}

      {/* Add Item Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Item</Text>

            <TextInput
              placeholder="Item Name"
              value={newItem.name}
              onChangeText={text => setNewItem({ ...newItem, name: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Quantity"
              keyboardType="number-pad"
              value={newItem.quantity}
              onChangeText={text => setNewItem({ ...newItem, quantity: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Price"
              keyboardType="decimal-pad"
              value={newItem.price}
              onChangeText={text => setNewItem({ ...newItem, price: text })}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const Feature = ({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.feature} onPress={onPress}>
    {icon}
    <Text style={styles.featureLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 10,
    color: "#444",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  feature: {
    alignItems: "center",
    marginBottom: 10,
    width: "23%",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureLabel: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    color: "#555",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    fontSize: 16,
    color: "#666",
  },
  quantity: {
    fontSize: 14,
    color: "#333",
  },
  lowStock: {
    fontSize: 14,
    color: "#FF3B30",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 16,
    fontSize: 16,
    paddingVertical: 6,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  featureTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: "#555",
  },
});

export default InventoryScreen;
