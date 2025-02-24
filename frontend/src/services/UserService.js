import api from "../utils/api";
const BASE_URL = "/users";

export const UserService = {
  async getUsers() {
    try {
      const response = await api.get(BASE_URL);
      console.log("Fetched Users:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getUsers:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch users.");
    }
  },

  async getUserID(id) {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      console.log("Fetched User:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getUserID:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch user.");
    }
  },

  async getUserRole(role) {
    try {
      const response = await api.get(`${BASE_URL}?role=${role}`);
      console.log("Fetched Users by Role:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getUserRole:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch users by role.");
    }
  },

  async createUser(user) {
    try {
      const headers = user instanceof FormData 
        ? { "Content-Type": "multipart/form-data" } 
        : { "Content-Type": "application/json" };

      const response = await api.post(BASE_URL, user, { headers });

      console.log("Created User:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw new Error(error.response?.data?.message || "Failed to create user.");
    }
  },

  async updateUser(userId, userData) {
    try {
      const headers = userData instanceof FormData 
        ? { "Content-Type": "multipart/form-data" } 
        : { "Content-Type": "application/json" };

      const response = await api.put(`${BASE_URL}/${userId}`, userData, { headers });

      console.log("Updated User:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw new Error(error.response?.data?.message || "Failed to update user.");
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`${BASE_URL}/${userId}`);
      console.log("Deleted User:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in deleteUser:", error);
      throw new Error(error.response?.data?.message || "Failed to delete user.");
    }
  },
};
