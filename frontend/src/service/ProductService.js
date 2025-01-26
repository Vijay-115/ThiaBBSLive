export const ProductService = {
    async getProducts() {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }
      console.log(response.json());
      return response.json();
    },
  
    async createProduct(product) {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error("Failed to create product.");
      }
      return response.json();
    },
  
    async updateProduct(productId, productData) {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error("Failed to update product.");
      }
      return response.json();
    },
  
    async deleteProduct(productId) {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product.");
      }
      return response.json();
    },
};
  