import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AnimalCard({ animal, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{animal.name}</Text>
      <Text style={styles.species}>🐾 {animal.species}</Text>
      <Text style={styles.status}>Status: {animal.conservationStatus}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editBtn]}
          onPress={() => onEdit(animal)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteBtn]}
          onPress={() => onDelete(animal._id)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#10B981",
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#1E293B" },
  species: {
    fontSize: 16,
    color: "#475569",
    marginTop: 4,
    fontStyle: "italic",
  },
  status: { fontSize: 14, color: "#059669", marginTop: 4, fontWeight: "600" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  editBtn: { backgroundColor: "#3B82F6" },
  deleteBtn: { backgroundColor: "#EF4444" },
  btnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
});
