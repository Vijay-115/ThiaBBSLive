import axios from "axios";

const BASE_URL = "http://localhost:5000/api/products";

export const ProductService = {
  async getProducts() {
    try {
      const response = await axios.get(BASE_URL);
      console.log("Fetched Products:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getProducts:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch products."
      );
    }
  },

  async createProduct(product) {
    try {
      // Get the token from localStorage or any other storage method
      const token = localStorage.getItem('token');  // Adjust this to your actual storage method
  
      const response = await axios.post(BASE_URL, product, {
        headers: {
          "Content-Type": "multipart/form-data",  // This is needed for form-data submissions, like file uploads
          "Authorization": `Bearer ${token}`     // Add the Authorization token in the headers
        },
      });
  
      console.log("Created Product:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create product."
      );
    }
  },
  

  async updateProduct(productId, productData) {
    try {
      const token = localStorage.getItem('token');  // Adjust this to your actual storage method
      const response = await axios.put(`${BASE_URL}/${productId}`, productData, {
        headers: { "Content-Type": "application/json" },
        headers: { 'Content-Type': 'multipart/form-data' },
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log("Updated Product:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in updateProduct:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update product."
      );
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await axios.delete(`${BASE_URL}/${productId}`);
      console.log("Deleted Product:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete product."
      );
    }
  },
};
