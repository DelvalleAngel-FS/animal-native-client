import api from "../../../config/api";

export const animalService = {
  // 1. READ (GET All)
  getAllAnimals: async () => {
    const response = await api.get("/api/animals");
    return response.data.data; // Unwraps the array from your controller's { data: animals } object
  },

  // 2. CREATE (POST New)
  createAnimal: async (animalData) => {
    const response = await api.post("/api/animals", animalData);
    return response.data.data;
  },

  // 3. UPDATE (PATCH Existing)
  updateAnimal: async (id, updatedData) => {
    const response = await api.patch(`/api/animals/${id}`, updatedData); // Matches router.patch
    return response.data.data;
  },

  // 4. DESTROY (DELETE)
  deleteAnimal: async (id) => {
    const response = await api.delete(`/api/animals/${id}`);
    return response.data.data;
  },
};
