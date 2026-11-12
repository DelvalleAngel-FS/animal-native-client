import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { animalService } from "./src/features/animals/services/animalService";
import AnimalCard from "./src/components/AnimalCard";

export default function App() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Input States matching your Mongoose Schema
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [conservationStatus, setConservationStatus] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalService.getAllAnimals();
      setAnimals(data || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not connect to your backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnimal = async () => {
    if (!name || !species || !conservationStatus) {
      Alert.alert("Validation", "Please fill out all fields.");
      return;
    }

    const payload = { name, species, conservationStatus };

    try {
      if (editingId) {
        await animalService.updateAnimal(editingId, payload);
        Alert.alert("Success", "Animal entry updated!");
      } else {
        await animalService.createAnimal(payload);
        Alert.alert("Success", "New animal added!");
      }

      clearForm();
      fetchAnimals();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save animal record.");
    }
  };

  const handleDeleteAnimal = async (id) => {
    Alert.alert(
      "Delete Animal",
      "Are you sure you want to remove this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await animalService.deleteAnimal(id);
              fetchAnimals();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Could not remove record.");
            }
          },
        },
      ],
    );
  };

  const handleEditPress = (animal) => {
    setEditingId(animal._id);
    setName(animal.name);
    setSpecies(animal.species);
    setConservationStatus(animal.conservationStatus);
  };

  const clearForm = () => {
    setName("");
    setSpecies("");
    setConservationStatus("");
    setEditingId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🐾 Animal Sanctuary Client</Text>

      <View style={styles.formContainer}>
        <Text style={styles.formHeading}>
          {editingId ? "✏️ Edit Animal Details" : "✨ Add New Entry"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Animal Name (e.g., Leo)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Species (e.g., African Lion)"
          value={species}
          onChangeText={setSpecies}
        />
        <TextInput
          style={styles.input}
          placeholder="Conservation Status (e.g., Vulnerable)"
          value={conservationStatus}
          onChangeText={setConservationStatus}
        />

        <View style={styles.formButtons}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSaveAnimal}
          >
            <Text style={styles.buttonText}>
              {editingId ? "Save Changes" : "Submit Entry"}
            </Text>
          </TouchableOpacity>
          {editingId && (
            <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#10B981"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={animals}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <AnimalCard
              animal={item}
              onEdit={handleEditPress}
              onDelete={handleDeleteAnimal}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No animals found. Add one above! 🌲
            </Text>
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingTop: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#0F172A",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  formHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#334155",
  },
  input: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 15,
    color: "#334155",
  },
  formButtons: { flexDirection: "row", gap: 10 },
  submitButton: {
    flex: 1,
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#64748B",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 40,
    fontSize: 16,
  },
});
