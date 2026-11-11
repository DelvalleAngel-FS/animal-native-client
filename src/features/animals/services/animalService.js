import api from "../../../config/api";

// Adjust the '/api/animals' endpoint path to match specific MERN backend routes
export const animalService = {
  // 1. READ (GET All)
  getAllAnimals: async () => {
    const response = await api.get("/api/animals");
    return response.data;
  },

  // 2. CREATE (POST New)
  createAnimal: async (animalData) => {
    const response = await api.post("/api/animals", animalData);
    return response.data;
  },

  // 3. UPDATE (PUT/PATCH Existing)
  updateAnimal: async (id, updatedData) => {
    const response = await api.put(`/api/animals/${id}`, updatedData);
    return response.data;
  },

  // 4. DESTROY (DELETE)
  deleteAnimal: async (id) => {
    const response = await api.delete(`/api/animals/${id}`);
    return response.data;
  },
};
