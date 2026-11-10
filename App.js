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
  // --- UI & Data States ---
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Form Input States ---
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null); // Tracks if we are creating or updating

  // Load animal data immediately when the app mounts
  useEffect(() => {
    fetchAnimals();
  }, []);

  // 1. GET (Read all animals)
  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalService.getAllAnimals();
      setAnimals(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not connect to your backend server.");
    } finally {
      setLoading(false);
    }
  };

  // 2 & 3. POST / PUT (Create new or save changes)
  const handleSaveAnimal = async () => {
    if (!name || !species || !age) {
      Alert.alert("Validation", "Please fill out all fields.");
      return;
    }

    const payload = { name, species, age: Number(age) };

    try {
      if (editingId) {
        // Run PUT Update request
        await animalService.updateAnimal(editingId, payload);
        Alert.alert("Success", "Animal entry updated!");
      } else {
        // Run POST Create request
        await animalService.createAnimal(payload);
        Alert.alert("Success", "New animal added!");
      }

      // Reset form states and refresh view
      clearForm();
      fetchAnimals();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save animal record.");
    }
  };

  // 4. DELETE (Remove animal record)
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

  // Populate fields to prepare for an update change
  const handleEditPress = (animal) => {
    setEditingId(animal._id);
    setName(animal.name);
    setSpecies(animal.species);
    setAge(animal.age.toString());
  };

  const clearForm = () => {
    setName("");
    setSpecies("");
    setAge("");
    setEditingId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🐾 Animal Sanctuary Client</Text>

      {/* Input CRUD Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.formHeading}>
          {editingId ? "✏️ Edit Animal Details" : "✨ Add New Entry"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Animal Name (e.g., Bella)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Species (e.g., Golden Retriever)"
          value={species}
          onChangeText={setSpecies}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          keyboardType="numeric"
          onChangeText={(age) => setName(age.replace(/[^0-9]/g, ""))} // Ensure numeric only
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

      {/* Dynamic List Section */}
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
  container: { flex: 1, backgroundColor: "#F8FAFC" },
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
