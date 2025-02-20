import api from "../utils/api";
const BASE_URL = "/products";

export const ProductService = {
  async getProducts() {
    try {
      const response = await api.get(BASE_URL);
      console.log("Fetched Products:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getProducts:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch products.");
    }
  },

  async createProduct(product) {
    try {
      const response = await api.post(BASE_URL, product, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });

      console.log("Created Product:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw new Error(error.response?.data?.message || "Failed to create product.");
    }
  },

  async updateProduct(productId, productData) {
    try {
      const response = await api.put(`${BASE_URL}/${productId}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Updated Product:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in updateProduct:", error);
      throw new Error(error.response?.data?.message || "Failed to update product.");
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await api.delete(`${BASE_URL}/${productId}`);
      console.log("Deleted Product:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      throw new Error(error.response?.data?.message || "Failed to delete product.");
    }
  },
};
